import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearStoredAuthToken,
  getCurrentUser,
  getStoredAuthToken,
  loginUser,
  registerUser,
  storeAuthToken
} from '../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const callbackToken = new URLSearchParams(window.location.search).get('token');
    if (callbackToken) {
      storeAuthToken(callbackToken);
      window.history.replaceState({}, document.title, '/');
      return callbackToken;
    }

    return getStoredAuthToken();
  });
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(token ? 'loading' : 'guest');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!token) {
        setUser(null);
        setStatus('guest');
        return;
      }

      try {
        setStatus('loading');
        const response = await getCurrentUser(token);
        if (!active) return;
        setUser(response.user);
        setStatus('authenticated');
      } catch {
        if (!active) return;
        clearStoredAuthToken();
        setToken(null);
        setUser(null);
        setStatus('guest');
      }
    }

    loadUser();
    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      error,
      isAuthenticated: status === 'authenticated' && Boolean(token),
      async login(credentials) {
        setError('');
        const response = await loginUser(credentials);
        storeAuthToken(response.accessToken);
        setToken(response.accessToken);
        setUser(response.user);
        setStatus('authenticated');
        return response;
      },
      async register(payload) {
        setError('');
        const response = await registerUser(payload);
        storeAuthToken(response.accessToken);
        setToken(response.accessToken);
        setUser(response.user);
        setStatus('authenticated');
        return response;
      },
      logout() {
        clearStoredAuthToken();
        setToken(null);
        setUser(null);
        setStatus('guest');
      },
      async refreshUser() {
        if (!token) return null;
        const response = await getCurrentUser(token);
        setUser(response.user);
        return response.user;
      },
      setError
    }),
    [error, status, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
