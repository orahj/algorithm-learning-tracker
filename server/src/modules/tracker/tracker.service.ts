import { Injectable } from '@nestjs/common';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { DailyLogsRepository } from './repositories/daily-logs.repository';
import { ProblemsRepository } from './repositories/problems.repository';
import { TopicNotesRepository } from './repositories/topic-notes.repository';

@Injectable()
export class TrackerService {
  constructor(
    private readonly dailyLogsRepository: DailyLogsRepository,
    private readonly problemsRepository: ProblemsRepository,
    private readonly topicNotesRepository: TopicNotesRepository
  ) {}

  async getOverview(userId: string) {
    const [dailyLogs, problems, notes] = await Promise.all([
      this.dailyLogsRepository.findAllForUser(userId),
      this.problemsRepository.findAllForUser(userId),
      this.topicNotesRepository.findAllForUser(userId)
    ]);

    return { dailyLogs, problems, notes };
  }

  getDailyLogs(userId: string) {
    return this.dailyLogsRepository.findAllForUser(userId);
  }

  createDailyLog(userId: string, dto: CreateDailyLogDto) {
    return this.dailyLogsRepository.createForUser(userId, dto);
  }

  updateDailyLog(userId: string, id: string, dto: UpdateDailyLogDto) {
    return this.dailyLogsRepository.updateForUser(userId, id, dto);
  }

  deleteDailyLog(userId: string, id: string) {
    return this.dailyLogsRepository.deleteForUser(userId, id);
  }

  getProblems(userId: string) {
    return this.problemsRepository.findAllForUser(userId);
  }

  createProblem(userId: string, dto: CreateProblemDto) {
    return this.problemsRepository.createForUser(userId, dto);
  }

  updateProblem(userId: string, id: string, dto: UpdateProblemDto) {
    return this.problemsRepository.updateForUser(userId, id, dto);
  }

  deleteProblem(userId: string, id: string) {
    return this.problemsRepository.deleteForUser(userId, id);
  }

  getNotes(userId: string) {
    return this.topicNotesRepository.findAllForUser(userId);
  }

  upsertNote(userId: string, topic: string, content: string) {
    return this.topicNotesRepository.upsertForUser(userId, topic, content);
  }
}
