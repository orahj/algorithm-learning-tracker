export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(startDate, endDate = todayIso()) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  return Math.max(0, Math.floor((end - start) / 86400000));
}

export function getPlanPositionForDate(startDate, targetDate = todayIso()) {
  const day = daysBetween(startDate, targetDate);
  const monthIndex = Math.min(2, Math.floor(day / 30));
  const weekIndex = Math.min(3, Math.floor((day % 30) / 7));
  return { month: monthIndex + 1, week: weekIndex + 1 };
}

export function isDue(date) {
  return Boolean(date) && date <= todayIso();
}
