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
    const user = await this.usersService.findById(userId);
    if (!user) throw new ForbiddenException('User not found');

    const period = currentUsagePeriod();
    const usageUser = await this.usersService.resetAiUsageIfNeeded(user, period);
    if (!usageUser) throw new ForbiddenException('User not found');

    const limit = planLimits[usageUser.plan].aiCoachCredits;
    if (usageUser.aiCoachUsageCount >= limit) {
      throw new ForbiddenException(`AI coach usage limit reached for this month (${limit} credits)`);
    }

    if (!this.openai) {
      if (this.configService.get<string>('NODE_ENV') === 'production' && this.configService.get<string>('AI_COACH_MOCK') !== 'true') {
        throw new ServiceUnavailableException('OpenAI is not configured');
      }

      await this.usersService.incrementAiCoachUsage(userId);
      return {
        answer: this.buildMockAnswer(dto),
        usage: {
          used: usageUser.aiCoachUsageCount + 1,
          limit,
          period
        },
        mock: true
      };
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

  private buildMockAnswer(dto: ExplainProblemDto) {
    const mode = dto.mode ?? 'explain';
    return [
      `Mock AI coach response for ${dto.problemName}.`,
      '',
      `Mode: ${mode}. Topic: ${dto.topic}. Language: ${dto.language}. Difficulty: ${dto.difficulty}.`,
      '',
      'How to think about it:',
      '1. Restate the problem in plain language and identify the input, output, and constraints.',
      `2. Match it to a known pattern. For this request, start by checking whether ${dto.topic} explains the pressure point.`,
      '3. Try the simplest brute-force idea first, then name exactly why it is too slow or too memory-heavy.',
      '4. Improve one bottleneck at a time and keep the invariant clear while coding.',
      '',
      dto.userApproach ? `Your current approach: ${dto.userApproach}` : 'Add your attempted approach next time and I can diagnose it more precisely.',
      dto.question ? `Your question: ${dto.question}` : 'Ask a specific question if you want hints instead of a full explanation.',
      '',
      'Add OPENAI_API_KEY in server/.env when you are ready for live AI responses.'
    ].join('\n');
  }
}
