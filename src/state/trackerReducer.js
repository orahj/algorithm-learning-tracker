import { todayIso } from '../utils/date';
import { importTrackerData } from '../services/trackerStorage';
import { trackerActionTypes } from './trackerActions';

function normalizeServerData(payload) {
  const notes = Array.isArray(payload.notes)
    ? Object.fromEntries(payload.notes.map((note) => [note.topic, note.content]))
    : payload.notes;

  return importTrackerData({
    ...payload,
    notes,
    dailyLogs: payload.dailyLogs || [],
    problems: payload.problems || []
  });
}

export function trackerReducer(state, action) {
  switch (action.type) {
    case trackerActionTypes.loadFromServer:
      return normalizeServerData(action.payload);

    case trackerActionTypes.addDailyLog:
      return {
        ...state,
        dailyLogs: [{ ...action.payload, timeSpent: Number(action.payload.timeSpent || 0) }, ...state.dailyLogs]
      };

    case trackerActionTypes.updateDailyLog:
      return {
        ...state,
        dailyLogs: state.dailyLogs.map((log) =>
          log.id === action.payload.id ? { ...log, ...action.payload.patch } : log
        )
      };

    case trackerActionTypes.removeDailyLog:
      return {
        ...state,
        dailyLogs: state.dailyLogs.filter((log) => log.id !== action.payload)
      };

    case trackerActionTypes.addProblem:
      return {
        ...state,
        problems: [action.payload, ...state.problems]
      };

    case trackerActionTypes.updateProblem:
      return {
        ...state,
        problems: state.problems.map((problem) =>
          problem.id === action.payload.id ? { ...problem, ...action.payload.patch } : problem
        )
      };

    case trackerActionTypes.removeProblem:
      return {
        ...state,
        problems: state.problems.filter((problem) => problem.id !== action.payload)
      };

    case trackerActionTypes.markReviewSolved:
      if (action.payload.type === 'Problem Bank') {
        return {
          ...state,
          problems: state.problems.map((problem) =>
            problem.id === action.payload.id
              ? { ...problem, status: 'Solved', lastAttemptedDate: todayIso(), repeatDate: '' }
              : problem
          )
        };
      }

      return {
        ...state,
        dailyLogs: state.dailyLogs.map((log) =>
          log.id === action.payload.id ? { ...log, status: 'Solved', repeatDate: '' } : log
        )
      };

    case trackerActionTypes.updateNote:
      return {
        ...state,
        notes: { ...state.notes, [action.payload.topic]: action.payload.value }
      };

    case trackerActionTypes.updateSetting:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };

    case trackerActionTypes.importData:
      return importTrackerData(action.payload);

    case trackerActionTypes.resetData:
      return action.payload;

    default:
      return state;
  }
}
