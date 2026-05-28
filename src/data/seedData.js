import { learningPlan } from './learningPlan';
import { topics } from './options';
import { todayIso } from '../utils/date';

const sampleProblemNames = [
  'Find max in array',
  'Find min in array',
  'Count even numbers',
  'Sum of array',
  'Reverse string',
  'Check palindrome string',
  'Two Sum',
  'First non-repeating character',
  'Move zeroes',
  'Remove duplicates from sorted array'
];

export function createEmptyDailyLog() {
  return {
    id: crypto.randomUUID(),
    date: todayIso(),
    language: 'C#',
    topic: 'Arrays',
    problemName: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    status: 'Tried',
    timeSpent: 60,
    mistakeMade: '',
    patternLearned: '',
    repeatDate: '',
    notes: ''
  };
}

export function createEmptyProblem() {
  return {
    id: crypto.randomUUID(),
    name: '',
    topic: 'Arrays',
    language: 'C#',
    difficulty: 'Easy',
    link: '',
    status: 'Not Started',
    lastAttemptedDate: '',
    repeatDate: '',
    notes: ''
  };
}

export function createSampleProblems() {
  return sampleProblemNames.map((name, index) => ({
    id: crypto.randomUUID(),
    name,
    topic: index < 4 ? 'Arrays' : index < 6 ? 'Strings' : index === 6 ? 'HashMap' : index === 7 ? 'Strings' : 'Arrays',
    language: 'C#',
    difficulty: index < 8 ? 'Easy' : 'Medium',
    link: '',
    status: 'Not Started',
    lastAttemptedDate: '',
    repeatDate: '',
    notes: 'Beginner C# Week 1 practice problem.'
  }));
}

export function createDefaultNotes() {
  return Object.fromEntries(
    topics.map((topic) => [
      topic,
      topic === 'Big O'
        ? 'Track time and space complexity. Start by identifying loops, nested loops, recursion depth, and data structures used.'
        : ''
    ])
  );
}

export function createDefaultTrackerData() {
  return {
    planStartDate: todayIso(),
    targetDailyMinutes: 60,
    dailyLogs: [],
    problems: createSampleProblems(),
    notes: createDefaultNotes(),
    learningPlan
  };
}
