import { useState } from 'react';
import { Code2, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { API_BASE_URL } from '../../services/apiClient';
import { useAuth } from '../../state/AuthProvider';

export function AuthPage({ onBack }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', displayName: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === 'register';

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">
            <Code2 size={24} />
          </div>
          <div>
            <p className="eyebrow">Algorithm Tracker</p>
            <h1>Sign in to sync your practice data.</h1>
          </div>
        </div>

        {onBack && <button className="auth-back" onClick={onBack}>Back to landing page</button>}

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            <LogIn size={16} /> Login
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            <UserPlus size={16} /> Register
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {isRegister && (
            <label className="field">
              <span>Name</span>
              <input value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} required />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="field">
            <span>Password</span>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                minLength={8}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary auth-submit" disabled={submitting}>
            {submitting ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>
        <a className="ghost google-link" href={`${API_BASE_URL}/auth/google`}>
          Continue with Google
        </a>
      </section>
    </main>
  );
}
