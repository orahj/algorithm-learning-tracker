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
