import { Badge } from '../../components/ui/Badge';
import { PageTitle } from '../../components/ui/PageTitle';
import { useTrackerActions, useTrackerState } from '../../state/TrackerProvider';
import { isDue } from '../../utils/date';

function getReviewQueue(data) {
  const dailyRepeats = data.dailyLogs
    .filter((item) => item.status === 'Repeat' || item.status === 'Solved With Help' || isDue(item.repeatDate))
    .map((item) => ({ ...item, type: 'Daily Log', name: item.problemName }));

  const problemRepeats = data.problems
    .filter((item) => item.status === 'Repeat' || item.status === 'Solved With Help' || isDue(item.repeatDate))
    .map((item) => ({ ...item, type: 'Problem Bank' }));

  return [...dailyRepeats, ...problemRepeats].sort((a, b) => (a.repeatDate || '9999').localeCompare(b.repeatDate || '9999'));
}

export function ReviewQueue() {
  const data = useTrackerState();
  const { markReviewSolved } = useTrackerActions();
  const queue = getReviewQueue(data);

  return (
    <section className="page">
      <PageTitle title="Review Queue" subtitle="Everything marked Repeat, Solved With Help, or due/overdue for repetition." />
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Problem</th><th>Source</th><th>Language</th><th>Topic</th><th>Status</th><th>Repeat date</th><th></th></tr>
          </thead>
          <tbody>
            {queue.map((item) => (
              <tr key={`${item.type}-${item.id}`}>
                <td><strong>{item.name}</strong></td>
                <td>{item.type}</td>
                <td><Badge>{item.language}</Badge></td>
                <td>{item.topic}</td>
                <td><Badge>{item.status}</Badge></td>
                <td className={isDue(item.repeatDate) ? 'danger-text' : ''}>{item.repeatDate || 'Not set'}</td>
                <td><button className="ghost" onClick={() => markReviewSolved(item)}>Mark solved</button></td>
              </tr>
            ))}
            {queue.length === 0 && <tr><td colSpan="7" className="empty">No review items. Nice work.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
