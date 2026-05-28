export function StatCard({ title, value, helper, icon: Icon }) {
  return (
    <div className="stat-card">
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        {helper && <span>{helper}</span>}
      </div>
      <div className="stat-icon">
        <Icon size={22} />
      </div>
    </div>
  );
}
