import { apiRequest } from './apiClient';

export function explainProblem(token, payload) {
  return apiRequest('/coach/explain', {
    method: 'POST',
    token,
    body: payload
  });
}
