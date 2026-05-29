import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';

@Module({
  imports: [UsersModule],
  controllers: [CoachController],
  providers: [CoachService]
})
export class CoachModule {}
