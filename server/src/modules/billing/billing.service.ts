import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { SubscriptionPlan, SubscriptionStatus } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { stripePriceEnvByPlan } from './billing-plans';

const Stripe = require('stripe');

function toSubscriptionStatus(status?: string): SubscriptionStatus {
  switch (status) {
    case 'active':
      return SubscriptionStatus.Active;
    case 'trialing':
      return SubscriptionStatus.Trialing;
    case 'past_due':
      return SubscriptionStatus.PastDue;
    case 'canceled':
      return SubscriptionStatus.Canceled;
    case 'incomplete':
      return SubscriptionStatus.Incomplete;
    default:
      return SubscriptionStatus.Free;
  }
}

@Injectable()
export class BillingService {
  private readonly stripe?: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey);
    }
  }

  async createCheckoutSession(user: AuthenticatedUser, plan: SubscriptionPlan.AiCoach | SubscriptionPlan.ProInterview) {
    if (!this.stripe) throw new ServiceUnavailableException('Stripe is not configured');

    const priceEnvName = stripePriceEnvByPlan[plan];
    const priceId = priceEnvName ? this.configService.get<string>(priceEnvName) : undefined;
    if (!priceId) throw new BadRequestException(`Missing Stripe price for plan: ${plan}`);

    const appUrl = this.configService.get<string>('CLIENT_URL') ?? 'http://localhost:5173';
    const dbUser = await this.usersService.findById(user.id);
    if (!dbUser) throw new BadRequestException('User not found');

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: dbUser.stripeCustomerId,
      customer_email: dbUser.stripeCustomerId ? undefined : dbUser.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/?checkout=success`,
      cancel_url: `${appUrl}/?checkout=cancelled`,
      metadata: {
        userId: dbUser.id,
        plan
      },
      subscription_data: {
        metadata: {
          userId: dbUser.id,
          plan
        }
      }
    });

    return { url: session.url };
  }

  constructWebhookEvent(rawBody: Buffer, signature: string) {
    if (!this.stripe) throw new ServiceUnavailableException('Stripe is not configured');
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) throw new ServiceUnavailableException('Stripe webhook secret is not configured');
    return this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }

  async handleWebhook(event: any) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this.handleSubscriptionChanged(event.data.object);
        break;
      default:
        break;
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(session: any) {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as SubscriptionPlan | undefined;
    if (!userId || !plan) return;

    await this.usersService.updateBilling(userId, {
      plan,
      subscriptionStatus: SubscriptionStatus.Active,
      stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
      stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined
    });
  }

  private async handleSubscriptionChanged(subscription: any) {
    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan as SubscriptionPlan | undefined;
    const currentPeriodEnd = subscription.items.data[0]?.current_period_end;

    let user = userId ? await this.usersService.findById(userId) : null;
    if (!user && typeof subscription.customer === 'string') {
      user = await this.usersService.findByStripeCustomerId(subscription.customer);
    }
    if (!user) return;

    const subscriptionStatus = toSubscriptionStatus(subscription.status);
    const nextPlan = subscriptionStatus === SubscriptionStatus.Canceled ? SubscriptionPlan.Free : plan || user.plan;

    await this.usersService.updateBilling(user.id, {
      plan: nextPlan,
      subscriptionStatus,
      stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : user.stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      subscriptionCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined
    });
  }
}
