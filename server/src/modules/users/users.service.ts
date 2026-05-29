import { Injectable } from '@nestjs/common';
import { SubscriptionPlan, SubscriptionStatus } from './entities/user.entity';
import { CreateLocalUserInput, UsersRepository, UpsertGoogleUserInput } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findByStripeCustomerId(stripeCustomerId: string) {
    return this.usersRepository.findByStripeCustomerId(stripeCustomerId);
  }

  findByStripeSubscriptionId(stripeSubscriptionId: string) {
    return this.usersRepository.findByStripeSubscriptionId(stripeSubscriptionId);
  }

  findByPaystackCustomerCode(paystackCustomerCode: string) {
    return this.usersRepository.findByPaystackCustomerCode(paystackCustomerCode);
  }

  createLocalUser(input: CreateLocalUserInput) {
    return this.usersRepository.createLocalUser(input);
  }

  upsertGoogleUser(input: UpsertGoogleUserInput) {
    return this.usersRepository.upsertGoogleUser(input);
  }

  updateBilling(
    userId: string,
    input: {
      plan?: SubscriptionPlan;
      subscriptionStatus?: SubscriptionStatus;
      stripeCustomerId?: string;
      stripeSubscriptionId?: string;
      paystackCustomerCode?: string;
      paystackSubscriptionCode?: string;
      paystackEmailToken?: string;
      subscriptionCurrentPeriodEnd?: Date;
    }
  ) {
    return this.usersRepository.updateBilling(userId, input);
  }

  resetAiUsageIfNeeded(user: Awaited<ReturnType<UsersRepository['findById']>>, period: string) {
    if (!user) return null;
    return this.usersRepository.resetAiUsageIfNeeded(user, period);
  }

  incrementAiCoachUsage(userId: string) {
    return this.usersRepository.incrementAiCoachUsage(userId);
  }
}
