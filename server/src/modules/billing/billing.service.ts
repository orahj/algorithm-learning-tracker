import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { SubscriptionPlan, SubscriptionStatus } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { paystackPlanEnvByPlan, planPricesInKobo, stripePriceEnvByPlan } from './billing-plans';

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
  private readonly paystackSecretKey?: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey);
    }
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  async createCheckoutSession(user: AuthenticatedUser, plan: SubscriptionPlan.AiCoach | SubscriptionPlan.ProInterview) {
    if (this.paystackSecretKey) return this.createPaystackCheckout(user, plan);
    return this.createStripeCheckout(user, plan);
  }

  private async createStripeCheckout(user: AuthenticatedUser, plan: SubscriptionPlan.AiCoach | SubscriptionPlan.ProInterview) {
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

    return { provider: 'stripe', url: session.url };
  }

  private async createPaystackCheckout(user: AuthenticatedUser, plan: SubscriptionPlan.AiCoach | SubscriptionPlan.ProInterview) {
    if (!this.paystackSecretKey) throw new ServiceUnavailableException('Paystack is not configured');

    const dbUser = await this.usersService.findById(user.id);
    if (!dbUser) throw new BadRequestException('User not found');

    const appUrl = this.configService.get<string>('CLIENT_URL') ?? 'http://localhost:5173';
    const planEnvName = paystackPlanEnvByPlan[plan];
    const paystackPlan = planEnvName ? this.configService.get<string>(planEnvName) : undefined;
    const amount = planPricesInKobo[plan];
    if (!paystackPlan) throw new BadRequestException(`Missing Paystack subscription plan for: ${plan}`);
    if (!amount) throw new BadRequestException(`Missing Paystack amount for plan: ${plan}`);

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: dbUser.email,
        amount,
        plan: paystackPlan,
        callback_url: `${appUrl}/?checkout=success`,
        metadata: {
          userId: dbUser.id,
          plan
        }
      })
    });

    const payload = await response.json();
    if (!response.ok || !payload.status) {
      throw new BadRequestException(payload.message || 'Unable to initialize Paystack checkout');
    }

    return {
      provider: 'paystack',
      url: payload.data.authorization_url,
      reference: payload.data.reference
    };
  }

  constructWebhookEvent(rawBody: Buffer, signature: string) {
    if (!this.stripe) throw new ServiceUnavailableException('Stripe is not configured');
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) throw new ServiceUnavailableException('Stripe webhook secret is not configured');
    return this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }

  constructPaystackWebhookEvent(rawBody: Buffer, signature: string) {
    if (!this.paystackSecretKey) throw new ServiceUnavailableException('Paystack is not configured');
    const expected = createHmac('sha512', this.paystackSecretKey).update(rawBody).digest('hex');
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
      throw new BadRequestException('Invalid Paystack webhook signature');
    }
    return JSON.parse(rawBody.toString('utf8'));
  }

  async verifyPaystackTransaction(user: AuthenticatedUser, reference: string) {
    if (!this.paystackSecretKey) throw new ServiceUnavailableException('Paystack is not configured');

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${this.paystackSecretKey}`
      }
    });

    const payload = await response.json();
    if (!response.ok || !payload.status) {
      throw new BadRequestException(payload.message || 'Unable to verify Paystack transaction');
    }

    const charge = payload.data;
    if (charge.status !== 'success') throw new BadRequestException('Paystack transaction was not successful');
    if (charge.metadata?.userId && charge.metadata.userId !== user.id) {
      throw new BadRequestException('Paystack transaction does not belong to this user');
    }

    await this.handlePaystackChargeSuccess(charge);
    return {
      verified: true,
      plan: charge.metadata?.plan,
      reference
    };
  }

  async handleStripeWebhook(event: any) {
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

  async handlePaystackWebhook(event: any) {
    switch (event.event) {
      case 'charge.success':
        await this.handlePaystackChargeSuccess(event.data);
        break;
      case 'subscription.create':
      case 'subscription.enable':
      case 'subscription.disable':
        await this.handlePaystackSubscriptionChanged(event.data, event.event);
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

  private async handlePaystackChargeSuccess(charge: any) {
    const userId = charge.metadata?.userId;
    const plan = charge.metadata?.plan as SubscriptionPlan | undefined;
    if (!userId || !plan) return;

    await this.usersService.updateBilling(userId, {
      plan,
      subscriptionStatus: SubscriptionStatus.Active,
      paystackCustomerCode: charge.customer?.customer_code,
      paystackSubscriptionCode: charge.subscription?.subscription_code,
      paystackEmailToken: charge.authorization?.authorization_code
    });
  }

  private async handlePaystackSubscriptionChanged(subscription: any, eventName: string) {
    const customerCode = subscription.customer?.customer_code || subscription.customer;
    const user = customerCode ? await this.usersService.findByPaystackCustomerCode(customerCode) : null;
    if (!user) return;

    const disabled = eventName === 'subscription.disable';
    await this.usersService.updateBilling(user.id, {
      plan: disabled ? SubscriptionPlan.Free : user.plan,
      subscriptionStatus: disabled ? SubscriptionStatus.Canceled : SubscriptionStatus.Active,
      paystackSubscriptionCode: subscription.subscription_code,
      paystackEmailToken: subscription.email_token
    });
  }
}
