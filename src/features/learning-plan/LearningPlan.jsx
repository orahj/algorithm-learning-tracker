import { Badge } from '../../components/ui/Badge';
import { PageTitle } from '../../components/ui/PageTitle';
import { useTrackerState } from '../../state/TrackerProvider';
import { getPlanPositionForDate } from '../../utils/date';

export function LearningPlan() {
  const data = useTrackerState();
  const current = getPlanPositionForDate(data.planStartDate);
  const completedWeekKeys = new Set(
    data.dailyLogs.map((log) => {
      const position = getPlanPositionForDate(data.planStartDate, log.date);
      return `${position.month}-${position.week}`;
    })
  );

  return (
    <section className="page">
      <PageTitle title="3-Month Learning Plan" subtitle="C# first, JavaScript second, Python third. One hour per day." />
      <div className="plan-grid">
        {data.learningPlan.map((month) => (
          <div className="plan-card" key={month.language}>
            <div className="plan-header">
              <Badge>{month.language}</Badge>
              <span>Month {month.month}</span>
            </div>
            <h3>{month.title}</h3>
            <div className="week-list">
              {month.weeks.map((week) => {
                const active = current.month === month.month && current.week === week.week;
                const done = completedWeekKeys.has(`${month.month}-${week.week}`);
                return (
                  <div className={`week-item ${active ? 'current' : ''}`} key={week.week}>
                    <div className="week-top">
                      <strong>Week {week.week}</strong>
                      {active && <Badge>Current</Badge>}
                      {done && !active && <Badge>Logged</Badge>}
                    </div>
                    <p>{week.title}</p>
                    <div className="topic-pills">
                      {week.topics.map((topic) => <span key={topic}>{topic}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
