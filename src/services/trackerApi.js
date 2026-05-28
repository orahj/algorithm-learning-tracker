import { apiRequest } from './apiClient';

function emptyToUndefined(value) {
  return value === '' ? undefined : value;
}

function sanitizeDailyLog(log) {
  return {
    date: log.date,
    language: log.language,
    topic: log.topic,
    problemName: log.problemName,
    platform: log.platform,
    difficulty: log.difficulty,
    status: log.status,
    timeSpent: Number(log.timeSpent || 0),
    mistakeMade: log.mistakeMade || '',
    patternLearned: log.patternLearned || '',
    repeatDate: emptyToUndefined(log.repeatDate),
    notes: log.notes || ''
  };
}

function sanitizeDailyLogPatch(patch) {
  return Object.fromEntries(
    Object.entries({
      ...patch,
      timeSpent: patch.timeSpent === undefined ? undefined : Number(patch.timeSpent || 0),
      repeatDate: emptyToUndefined(patch.repeatDate)
    }).filter(([, value]) => value !== undefined)
  );
}

function sanitizeProblem(problem) {
  return {
    name: problem.name,
    topic: problem.topic,
    language: problem.language,
    difficulty: problem.difficulty,
    link: emptyToUndefined(problem.link),
    status: problem.status,
    lastAttemptedDate: emptyToUndefined(problem.lastAttemptedDate),
    repeatDate: emptyToUndefined(problem.repeatDate),
    notes: problem.notes || ''
  };
}

function sanitizeProblemPatch(patch) {
  return Object.fromEntries(
    Object.entries({
      ...patch,
      link: emptyToUndefined(patch.link),
      lastAttemptedDate: emptyToUndefined(patch.lastAttemptedDate),
      repeatDate: emptyToUndefined(patch.repeatDate)
    }).filter(([, value]) => value !== undefined)
  );
}

export function getTrackerOverview(token) {
  return apiRequest('/tracker', { method: 'GET', token });
}

export function createDailyLog(token, log) {
  return apiRequest('/tracker/daily-logs', {
    method: 'POST',
    token,
    body: sanitizeDailyLog(log)
  });
}

export function deleteDailyLog(token, id) {
  return apiRequest(`/tracker/daily-logs/${id}`, {
    method: 'DELETE',
    token
  });
}

export function updateDailyLog(token, id, patch) {
  return apiRequest(`/tracker/daily-logs/${id}`, {
    method: 'PATCH',
    token,
    body: sanitizeDailyLogPatch(patch)
  });
}

export function createProblem(token, problem) {
  return apiRequest('/tracker/problems', {
    method: 'POST',
    token,
    body: sanitizeProblem(problem)
  });
}

export function updateProblem(token, id, patch) {
  return apiRequest(`/tracker/problems/${id}`, {
    method: 'PATCH',
    token,
    body: sanitizeProblemPatch(patch)
  });
}

export function deleteProblem(token, id) {
  return apiRequest(`/tracker/problems/${id}`, {
    method: 'DELETE',
    token
  });
}

export function updateTopicNote(token, topic, content) {
  return apiRequest(`/tracker/notes/${encodeURIComponent(topic)}`, {
    method: 'PATCH',
    token,
    body: { content }
  });
}
