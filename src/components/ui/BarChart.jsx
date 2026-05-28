export function BarChart({ title, data }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = Math.max(1, ...entries.map(([, value]) => value));

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {entries.length === 0 ? <p className="muted">No data yet. Add daily logs to see progress.</p> : null}
      <div className="bars">
        {entries.map(([label, value]) => (
          <div className="bar-row" key={label}>
            <span>{label}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(value / max) * 100}%` }} />
            </div>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
