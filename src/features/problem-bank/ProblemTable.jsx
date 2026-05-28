import { Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { statuses } from '../../data/options';
import { todayIso, isDue } from '../../utils/date';

export function ProblemTable({ problems, remove, updateProblem }) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr><th>Problem</th><th>Language</th><th>Topic</th><th>Difficulty</th><th>Status</th><th>Last attempted</th><th>Repeat</th><th></th></tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id}>
              <td>
                <strong>
                  {problem.link ? <a href={problem.link} target="_blank" rel="noreferrer">{problem.name}</a> : problem.name}
                </strong>
                <p className="small-note">{problem.notes}</p>
              </td>
              <td><Badge>{problem.language}</Badge></td>
              <td>{problem.topic}</td>
              <td>{problem.difficulty}</td>
              <td>
                <select
                  className="inline-select"
                  value={problem.status}
                  onChange={(event) => updateProblem(problem.id, { status: event.target.value, lastAttemptedDate: todayIso() })}
                >
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </td>
              <td>{problem.lastAttemptedDate || '-'}</td>
              <td className={isDue(problem.repeatDate) ? 'danger-text' : ''}>{problem.repeatDate || '-'}</td>
              <td><button className="icon-btn" onClick={() => remove(problem.id)} aria-label="Remove problem"><Trash2 size={16} /></button></td>
            </tr>
          ))}
          {problems.length === 0 && <tr><td colSpan="8" className="empty">No problems found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
