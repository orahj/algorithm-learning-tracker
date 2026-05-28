import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyLog } from './entities/daily-log.entity';
import { Problem } from './entities/problem.entity';
import { TopicNote } from './entities/topic-note.entity';
import { DailyLogsRepository } from './repositories/daily-logs.repository';
import { ProblemsRepository } from './repositories/problems.repository';
import { TopicNotesRepository } from './repositories/topic-notes.repository';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailyLog, Problem, TopicNote])],
  controllers: [TrackerController],
  providers: [TrackerService, DailyLogsRepository, ProblemsRepository, TopicNotesRepository]
})
export class TrackerModule {}
