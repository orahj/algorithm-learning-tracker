import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { DailyLog } from '../features/daily-log/DailyLog';
import { Dashboard } from '../features/dashboard/Dashboard';
import { LearningPlan } from '../features/learning-plan/LearningPlan';
import { Notes } from '../features/notes/Notes';
import { ProblemBank } from '../features/problem-bank/ProblemBank';
import { ReviewQueue } from '../features/review-queue/ReviewQueue';
import { SettingsPage } from '../features/settings/SettingsPage';
import { AuthPage } from '../features/auth/AuthPage';
import { CoachPage } from '../features/coach/CoachPage';
import { LandingPage } from '../features/landing/LandingPage';
import { verifyPaystackTransaction } from '../services/billingApi';
import { useAuth } from '../state/AuthProvider';
import { useTrackerState } from '../state/TrackerProvider';

function getActivePage(active) {
  switch (active) {
    case 'Learning Plan':
      return <LearningPlan />;
    case 'Daily Log':
      return <DailyLog />;
    case 'Problem Bank':
      return <ProblemBank />;
    case 'Review Queue':
      return <ReviewQueue />;
    case 'Notes':
      return <Notes />;
    case 'AI Coach':
      return <CoachPage />;
    case 'Settings':
      return <SettingsPage />;
    default:
      return <Dashboard />;
  }
}

export function App() {
  const { isAuthenticated, logout, refreshUser, status, token, user } = useAuth();
  const data = useTrackerState();
  const [active, setActive] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publicView, setPublicView] = useState('landing');
  const page = useMemo(() => getActivePage(active), [active]);

  function handleLogout() {
    logout();
    setActive('Dashboard');
    setSidebarOpen(false);
    setPublicView('landing');
  }

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref');
    if (!reference) return;

    window.history.replaceState({}, document.title, '/');
    verifyPaystackTransaction(token, reference)
      .then(() => refreshUser())
      .catch(() => {});
  }, [isAuthenticated, refreshUser, token]);

  if (status === 'loading') {
    return <main className="auth-page"><p className="muted">Loading your workspace...</p></main>;
  }

  if (!isAuthenticated) {
    if (publicView === 'auth') {
      return <AuthPage onBack={() => setPublicView('landing')} />;
    }

    return <LandingPage onStart={() => setPublicView('auth')} onLogin={() => setPublicView('auth')} />;
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} open={sidebarOpen} setOpen={setSidebarOpen} />
      <main>
        <Topbar targetDailyMinutes={data.targetDailyMinutes} user={user} onLogout={handleLogout} />
        {page}
      </main>
    </div>
  );
}
