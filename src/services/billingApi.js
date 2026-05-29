import { apiRequest } from './apiClient';

export function createCheckoutSession(token, plan) {
  return apiRequest('/billing/checkout-session', {
    method: 'POST',
    token,
    body: { plan }
  });
}
