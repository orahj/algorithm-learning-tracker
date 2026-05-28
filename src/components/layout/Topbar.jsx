import { Clock } from 'lucide-react';

export function Topbar({ targetDailyMinutes, user, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p>Today</p>
        <h2>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h2>
      </div>
      <div className="topbar-actions">
        <div className="target-pill">
          <Clock size={18} />
          Daily target: {targetDailyMinutes} mins
        </div>
        {user && (
          <button className="ghost user-pill" onClick={onLogout}>
            {user.displayName}
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
