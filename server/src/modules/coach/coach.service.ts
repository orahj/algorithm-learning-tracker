import { ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { planLimits } from '../billing/billing-plans';
import { UsersService } from '../users/users.service';
import { ExplainProblemDto } from './dto/explain-problem.dto';
import { buildAlgorithmCoachPrompt } from './prompts/algorithm-coach.prompt';

function currentUsagePeriod() {
  return new Date().toISOString().slice(0, 7);
}

@Injectable()
export class CoachService {
  private readonly openai?: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) this.openai = new OpenAI({ apiKey });
  }

  async explainProblem(userId: string, dto: ExplainProblemDto) {
    if (!this.openai) throw new ServiceUnavailableException('OpenAI is not configured');

    const user = await this.usersService.findById(userId);
    if (!user) throw new ForbiddenException('User not found');

    const period = currentUsagePeriod();
    const usageUser = await this.usersService.resetAiUsageIfNeeded(user, period);
    if (!usageUser) throw new ForbiddenException('User not found');

    const limit = planLimits[usageUser.plan].aiCoachCredits;
    if (usageUser.aiCoachUsageCount >= limit) {
      throw new ForbiddenException(`AI coach usage limit reached for this month (${limit} credits)`);
    }

    const model = this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4.1-mini';
    const response = await this.openai.responses.create({
      model,
      instructions: 'You are a patient algorithm tutor. Teach structure, patterns, and reasoning. Avoid giving only final answers.',
      input: buildAlgorithmCoachPrompt(dto),
      max_output_tokens: 900
    });

    await this.usersService.incrementAiCoachUsage(userId);

    return {
      answer: response.output_text,
      usage: {
        used: usageUser.aiCoachUsageCount + 1,
        limit,
        period
      }
    };
  }
}
