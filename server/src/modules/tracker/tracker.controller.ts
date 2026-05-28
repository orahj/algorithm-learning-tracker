import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { UpsertTopicNoteDto } from './dto/upsert-topic-note.dto';
import { TrackerService } from './tracker.service';

@Controller('tracker')
@ApiTags('tracker')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get()
  getOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.trackerService.getOverview(user.id);
  }

  @Get('daily-logs')
  getDailyLogs(@CurrentUser() user: AuthenticatedUser) {
    return this.trackerService.getDailyLogs(user.id);
  }

  @Post('daily-logs')
  createDailyLog(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateDailyLogDto) {
    return this.trackerService.createDailyLog(user.id, dto);
  }

  @Patch('daily-logs/:id')
  updateDailyLog(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateDailyLogDto) {
    return this.trackerService.updateDailyLog(user.id, id, dto);
  }

  @Delete('daily-logs/:id')
  deleteDailyLog(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.trackerService.deleteDailyLog(user.id, id);
  }

  @Get('problems')
  getProblems(@CurrentUser() user: AuthenticatedUser) {
    return this.trackerService.getProblems(user.id);
  }

  @Post('problems')
  createProblem(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProblemDto) {
    return this.trackerService.createProblem(user.id, dto);
  }

  @Patch('problems/:id')
  updateProblem(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateProblemDto) {
    return this.trackerService.updateProblem(user.id, id, dto);
  }

  @Delete('problems/:id')
  deleteProblem(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.trackerService.deleteProblem(user.id, id);
  }

  @Get('notes')
  getNotes(@CurrentUser() user: AuthenticatedUser) {
    return this.trackerService.getNotes(user.id);
  }

  @Patch('notes/:topic')
  upsertNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param('topic') topic: string,
    @Body() dto: UpsertTopicNoteDto
  ) {
    return this.trackerService.upsertNote(user.id, topic, dto.content);
  }
}
