import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { DailyLog } from '../modules/tracker/entities/daily-log.entity';
import { Problem } from '../modules/tracker/entities/problem.entity';
import { TopicNote } from '../modules/tracker/entities/topic-note.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH') ?? './data/tracker.sqlite',
        entities: [User, DailyLog, Problem, TopicNote],
        synchronize: configService.get<string>('NODE_ENV') !== 'production'
      })
    })
  ]
})
export class DatabaseModule {}
