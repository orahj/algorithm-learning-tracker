import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CoachService } from './coach.service';
import { ExplainProblemDto } from './dto/explain-problem.dto';

@Controller('coach')
@ApiTags('coach')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post('explain')
  explainProblem(@CurrentUser() user: AuthenticatedUser, @Body() dto: ExplainProblemDto) {
    return this.coachService.explainProblem(user.id, dto);
  }
}
