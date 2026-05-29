import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { SubscriptionPlan } from '../../users/entities/user.entity';

export class CreateCheckoutSessionDto {
  @ApiProperty({ enum: [SubscriptionPlan.AiCoach, SubscriptionPlan.ProInterview], example: SubscriptionPlan.AiCoach })
  @IsIn([SubscriptionPlan.AiCoach, SubscriptionPlan.ProInterview])
  plan: SubscriptionPlan.AiCoach | SubscriptionPlan.ProInterview;
}
