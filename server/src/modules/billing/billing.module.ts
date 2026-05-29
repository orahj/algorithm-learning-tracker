import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [UsersModule],
  controllers: [BillingController],
  providers: [BillingService]
})
export class BillingModule {}
