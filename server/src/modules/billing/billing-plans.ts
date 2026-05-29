import { SubscriptionPlan } from '../users/entities/user.entity';

export const planLimits: Record<SubscriptionPlan, { aiCoachCredits: number }> = {
  [SubscriptionPlan.Free]: { aiCoachCredits: 3 },
  [SubscriptionPlan.AiCoach]: { aiCoachCredits: 100 },
  [SubscriptionPlan.ProInterview]: { aiCoachCredits: 300 }
};

export const stripePriceEnvByPlan: Partial<Record<SubscriptionPlan, string>> = {
  [SubscriptionPlan.AiCoach]: 'STRIPE_PRICE_AI_COACH',
  [SubscriptionPlan.ProInterview]: 'STRIPE_PRICE_PRO_INTERVIEW'
};

export const paystackPlanEnvByPlan: Partial<Record<SubscriptionPlan, string>> = {
  [SubscriptionPlan.AiCoach]: 'PAYSTACK_PLAN_AI_COACH',
  [SubscriptionPlan.ProInterview]: 'PAYSTACK_PLAN_PRO_INTERVIEW'
};

export const planPricesInKobo: Partial<Record<SubscriptionPlan, number>> = {
  [SubscriptionPlan.AiCoach]: 900 * 100,
  [SubscriptionPlan.ProInterview]: 1900 * 100
};
