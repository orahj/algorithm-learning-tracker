import { todayIso } from './date';

export function currentStreak(logs) {
  const dates = new Set(logs.map((log) => log.date));
  let count = 0;
  const cursor = new Date(`${todayIso()}T00:00:00`);

  while (dates.has(cursor.toISOString().slice(0, 10))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return count;
}

export function groupCount(items, key, solvedOnly = true) {
  return items.reduce((acc, item) => {
    if (solvedOnly && !['Solved', 'Solved With Help'].includes(item.status)) return acc;
    const label = item[key] || 'Unspecified';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
}

export function minutesByWeek(logs) {
  return logs.reduce((acc, log) => {
    const date = new Date(`${log.date}T00:00:00`);
    const firstDay = new Date(date);
    const day = firstDay.getDay() || 7;
    firstDay.setDate(firstDay.getDate() - day + 1);
    const label = firstDay.toISOString().slice(0, 10);
    acc[label] = (acc[label] || 0) + Number(log.timeSpent || 0);
    return acc;
  }, {});
}
