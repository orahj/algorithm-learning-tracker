import { createDefaultTrackerData } from '../data/seedData';

export const STORAGE_KEY = 'algorithm-learning-tracker-v1';

function normalizeTrackerData(data) {
  const defaults = createDefaultTrackerData();

  return {
    ...defaults,
    ...data,
    dailyLogs: Array.isArray(data?.dailyLogs) ? data.dailyLogs : defaults.dailyLogs,
    problems: Array.isArray(data?.problems) ? data.problems : defaults.problems,
    learningPlan: Array.isArray(data?.learningPlan) ? data.learningPlan : defaults.learningPlan,
    notes: data?.notes && typeof data.notes === 'object' ? { ...defaults.notes, ...data.notes } : defaults.notes,
    targetDailyMinutes: Number(data?.targetDailyMinutes || defaults.targetDailyMinutes)
  };
}

export function loadTrackerData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return createDefaultTrackerData();

  try {
    return normalizeTrackerData(JSON.parse(saved));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return createDefaultTrackerData();
  }
}

export function saveTrackerData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function importTrackerData(data) {
  return normalizeTrackerData(data);
}

export function resetTrackerStorage() {
  localStorage.removeItem(STORAGE_KEY);
  return createDefaultTrackerData();
}
