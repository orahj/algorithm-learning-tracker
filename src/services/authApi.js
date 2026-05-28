import { apiRequest } from './apiClient';

export const AUTH_TOKEN_KEY = 'algorithm-learning-tracker-auth-token';

export function getStoredAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload
  });
}

export function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: payload
  });
}

export function getCurrentUser(token) {
  return apiRequest('/auth/me', {
    method: 'GET',
    token
  });
}
