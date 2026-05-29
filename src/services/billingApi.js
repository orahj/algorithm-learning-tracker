import { apiRequest } from './apiClient';

export function createCheckoutSession(token, plan) {
  return apiRequest('/billing/checkout-session', {
    method: 'POST',
    token,
    body: { plan }
  });
}

export function verifyPaystackTransaction(token, reference) {
  return apiRequest('/billing/paystack/verify', {
    method: 'POST',
    token,
    body: { reference }
  });
}
