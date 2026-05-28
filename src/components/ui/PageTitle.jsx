export function PageTitle({ title, subtitle }) {
  return (
    <div className="page-title">
      <div>
        <span className="eyebrow">Algorithm Tracker</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
