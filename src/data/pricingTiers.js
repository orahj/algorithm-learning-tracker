export const pricingTiers = [
  {
    id: 'free',
    name: 'Free Tracker',
    price: '$0',
    interval: 'forever',
    description: 'Start the 3-month structure and build consistency.',
    features: ['90-day roadmap', 'Daily logs', 'Problem bank', 'Review queue', 'Topic notes', '3 AI coach credits per month'],
    featured: false
  },
  {
    id: 'ai_coach',
    name: 'AI Coach',
    price: '$9',
    interval: 'per month',
    description: 'Learn why solutions work and what pattern to use next.',
    features: ['100 AI coach credits per month', 'Pattern breakdowns', 'Mistake diagnosis', 'Weekly study plan', 'Code walkthroughs'],
    featured: true
  },
  {
    id: 'pro_interview',
    name: 'Pro Interview',
    price: '$19',
    interval: 'per month',
    description: 'Prepare deeply with feedback, repetition, and interview mode.',
    features: ['300 AI coach credits per month', 'Mock interviews', 'Advanced analytics', 'Unlimited review plans', 'Priority AI usage'],
    featured: false
  }
];
