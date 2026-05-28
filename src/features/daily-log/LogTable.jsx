import { Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { isDue } from '../../utils/date';

export function LogTable({ logs, remove }) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr><th>Date</th><th>Problem</th><th>Language</th><th>Topic</th><th>Difficulty</th><th>Status</th><th>Minutes</th><th>Repeat</th><th></th></tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.date}</td>
              <td>
                <strong>{log.problemName}</strong>
                <p className="small-note">{log.patternLearned || log.mistakeMade}</p>
              </td>
              <td><Badge>{log.language}</Badge></td>
              <td>{log.topic}</td>
              <td>{log.difficulty}</td>
              <td><Badge>{log.status}</Badge></td>
              <td>{log.timeSpent}</td>
              <td className={isDue(log.repeatDate) ? 'danger-text' : ''}>{log.repeatDate || '-'}</td>
              <td><button className="icon-btn" onClick={() => remove(log.id)} aria-label="Remove log"><Trash2 size={16} /></button></td>
            </tr>
          ))}
          {logs.length === 0 && <tr><td colSpan="9" className="empty">No logs found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
