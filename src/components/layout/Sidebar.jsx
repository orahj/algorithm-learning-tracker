import {
  CalendarDays,
  ClipboardList,
  Code2,
  Database,
  LayoutDashboard,
  Menu,
  NotebookPen,
  RotateCcw,
  Settings,
  X
} from 'lucide-react';

const navItems = [
  ['Dashboard', LayoutDashboard],
  ['Learning Plan', CalendarDays],
  ['Daily Log', ClipboardList],
  ['Problem Bank', Database],
  ['Review Queue', RotateCcw],
  ['Notes', NotebookPen],
  ['Settings', Settings]
];

export function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Code2 size={22} />
          </div>
          <div>
            <h1>Algo Command</h1>
            <p>3-month tracker</p>
          </div>
          <button className="close-menu" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav>
          {navItems.map(([label, Icon]) => (
            <button
              key={label}
              className={active === label ? 'active' : ''}
              onClick={() => {
                setActive(label);
                setOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
