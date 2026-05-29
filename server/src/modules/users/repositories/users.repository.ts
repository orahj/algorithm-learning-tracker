import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthProvider, SubscriptionPlan, SubscriptionStatus, User } from '../entities/user.entity';

export type UpsertGoogleUserInput = {
  email: string;
  displayName: string;
  providerId: string;
  avatarUrl?: string;
};

export type CreateLocalUserInput = {
  email: string;
  displayName: string;
  passwordHash: string;
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email: email.toLowerCase() } });
  }

  findByStripeCustomerId(stripeCustomerId: string) {
    return this.repository.findOne({ where: { stripeCustomerId } });
  }

  findByStripeSubscriptionId(stripeSubscriptionId: string) {
    return this.repository.findOne({ where: { stripeSubscriptionId } });
  }

  findByPaystackCustomerCode(paystackCustomerCode: string) {
    return this.repository.findOne({ where: { paystackCustomerCode } });
  }

  createLocalUser(input: CreateLocalUserInput) {
    return this.repository.save(
      this.repository.create({
        email: input.email.toLowerCase(),
        displayName: input.displayName,
        passwordHash: input.passwordHash,
        provider: AuthProvider.Local
      })
    );
  }

  async upsertGoogleUser(input: UpsertGoogleUserInput) {
    const existing = await this.findByEmail(input.email);

    if (existing) {
      return this.repository.save({
        ...existing,
        displayName: input.displayName,
        avatarUrl: input.avatarUrl,
        provider: AuthProvider.Google,
        providerId: input.providerId
      });
    }

    return this.repository.save(
      this.repository.create({
        email: input.email.toLowerCase(),
        displayName: input.displayName,
        avatarUrl: input.avatarUrl,
        provider: AuthProvider.Google,
        providerId: input.providerId
      })
    );
  }

  async updateBilling(
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
    const user = await this.findById(userId);
    if (!user) return null;
    return this.repository.save({ ...user, ...input });
  }

  async resetAiUsageIfNeeded(user: User, period: string) {
    if (user.aiCoachUsagePeriod === period) return user;

    return this.repository.save({
      ...user,
      aiCoachUsagePeriod: period,
      aiCoachUsageCount: 0
    });
  }

  async incrementAiCoachUsage(userId: string) {
    await this.repository.increment({ id: userId }, 'aiCoachUsageCount', 1);
    return this.findById(userId);
  }
}
