import { CalendarDays, Code2, Flame, RotateCcw, Target, Trophy } from 'lucide-react';
import { BarChart } from '../../components/ui/BarChart';
import { StatCard } from '../../components/ui/StatCard';
import { useTrackerState } from '../../state/TrackerProvider';
import { daysBetween, getPlanPositionForDate, isDue } from '../../utils/date';
import { currentStreak, groupCount, minutesByWeek } from '../../utils/stats';

export function Dashboard() {
  const data = useTrackerState();
  const current = getPlanPositionForDate(data.planStartDate);
  const currentPlanMonth = data.learningPlan[current.month - 1];
  const totalDays = new Set(data.dailyLogs.map((log) => log.date)).size;
  const solved = data.problems.filter((item) => ['Solved', 'Solved With Help'].includes(item.status)).length
    + data.dailyLogs.filter((item) => ['Solved', 'Solved With Help'].includes(item.status)).length;
  const solvedHelp = data.problems.filter((item) => item.status === 'Solved With Help').length
    + data.dailyLogs.filter((item) => item.status === 'Solved With Help').length;
  const repeatCount = data.problems.filter((item) => item.status === 'Repeat' || isDue(item.repeatDate)).length
    + data.dailyLogs.filter((item) => item.status === 'Repeat' || isDue(item.repeatDate)).length;
  const completion = Math.min(100, Math.round((daysBetween(data.planStartDate) / 90) * 100));
  const allPracticeItems = [...data.problems, ...data.dailyLogs.map((item) => ({ ...item, name: item.problemName }))];

  return (
    <section className="page">
      <div className="hero">
        <div>
          <span className="eyebrow">Personal learning command center</span>
          <h2>Stay consistent for 90 days.</h2>
          <p>Track practice, mistakes, repeats, and language progress without needing a backend.</p>
        </div>
        <div className="hero-progress">
          <strong>{completion}%</strong>
          <span>3-month plan completion</span>
          <div className="progress">
            <div style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total days practiced" value={totalDays} helper="Unique practice dates" icon={CalendarDays} />
        <StatCard title="Current month/language" value={`Month ${current.month}`} helper={`${currentPlanMonth.language} - Week ${current.week}`} icon={Code2} />
        <StatCard title="Total problems solved" value={solved} helper="Solved + solved with help" icon={Trophy} />
        <StatCard title="Solved with help" value={solvedHelp} helper="Review these again" icon={Target} />
        <StatCard title="Problems to repeat" value={repeatCount} helper="Repeat/due/overdue" icon={RotateCcw} />
        <StatCard title="Current streak" value={`${currentStreak(data.dailyLogs)} days`} helper="Based on daily logs" icon={Flame} />
      </div>

      <div className="charts-grid">
        <BarChart title="Problems solved by language" data={groupCount(allPracticeItems, 'language')} />
        <BarChart title="Problems solved by topic" data={groupCount(allPracticeItems, 'topic')} />
        <BarChart title="Practice minutes per week" data={minutesByWeek(data.dailyLogs)} />
        <BarChart title="Status breakdown" data={groupCount(allPracticeItems, 'status', false)} />
      </div>
    </section>
  );
}
