import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { DailyLog } from '../modules/tracker/entities/daily-log.entity';
import { Problem } from '../modules/tracker/entities/problem.entity';
import { TopicNote } from '../modules/tracker/entities/topic-note.entity';

function shouldSynchronize(configService: ConfigService) {
  const configuredValue = configService.get<string>('DATABASE_SYNCHRONIZE');
  if (configuredValue !== undefined) return configuredValue === 'true';
  return configService.get<string>('NODE_ENV') !== 'production';
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const baseConfig = {
          entities: [User, DailyLog, Problem, TopicNote],
          synchronize: shouldSynchronize(configService)
        };

        if (databaseUrl) {
          return {
            ...baseConfig,
            type: 'postgres',
            url: databaseUrl,
            ssl: configService.get<string>('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : undefined
          };
        }

        return {
          ...baseConfig,
          type: 'sqlite',
          database: configService.get<string>('DATABASE_PATH') ?? './data/tracker.sqlite'
        };
      }
    })
  ]
})
export class DatabaseModule {}
