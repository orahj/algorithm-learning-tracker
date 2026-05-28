export function Badge({ children }) {
  const value = String(children || '').toLowerCase().replaceAll(' ', '-').replace('#', 'sharp');
  return <span className={`badge badge-${value}`}>{children}</span>;
}
