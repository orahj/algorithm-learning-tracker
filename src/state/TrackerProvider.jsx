import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { useAuth } from './AuthProvider';
import { loadTrackerData, saveTrackerData } from '../services/trackerStorage';
import {
  createDailyLog,
  createProblem,
  deleteDailyLog,
  deleteProblem,
  getTrackerOverview,
  updateDailyLog as updateDailyLogRequest,
  updateProblem as updateProblemRequest,
  updateTopicNote
} from '../services/trackerApi';
import { trackerActions } from './trackerActions';
import { trackerReducer } from './trackerReducer';
import { todayIso } from '../utils/date';

const TrackerStateContext = createContext(null);
const TrackerDispatchContext = createContext(null);

export function TrackerProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [state, dispatch] = useReducer(trackerReducer, undefined, loadTrackerData);

  useEffect(() => {
    if (!isAuthenticated) saveTrackerData(state);
  }, [isAuthenticated, state]);

  useEffect(() => {
    let active = true;

    async function loadServerData() {
      if (!isAuthenticated || !token) return;
      const overview = await getTrackerOverview(token);
      if (active) dispatch(trackerActions.loadFromServer(overview));
    }

    loadServerData().catch((error) => {
      console.error('Failed to load tracker data', error);
    });

    return () => {
      active = false;
    };
  }, [isAuthenticated, token]);

  const actions = useMemo(
    () => ({
      async addDailyLog(log) {
        const saved = isAuthenticated && token ? await createDailyLog(token, log) : log;
        dispatch(trackerActions.addDailyLog(saved));
      },
      async removeDailyLog(id) {
        if (isAuthenticated && token) await deleteDailyLog(token, id);
        dispatch(trackerActions.removeDailyLog(id));
      },
      async addProblem(problem) {
        const saved = isAuthenticated && token ? await createProblem(token, problem) : problem;
        dispatch(trackerActions.addProblem(saved));
      },
      async updateProblem(id, patch) {
        const saved = isAuthenticated && token ? await updateProblemRequest(token, id, patch) : null;
        dispatch(trackerActions.updateProblem(id, saved || patch));
      },
      async removeProblem(id) {
        if (isAuthenticated && token) await deleteProblem(token, id);
        dispatch(trackerActions.removeProblem(id));
      },
      async markReviewSolved(item) {
        if (isAuthenticated && token) {
          if (item.type === 'Problem Bank') {
            const saved = await updateProblemRequest(token, item.id, { status: 'Solved', lastAttemptedDate: todayIso(), repeatDate: '' });
            dispatch(trackerActions.updateProblem(item.id, saved));
            return;
          }

          const saved = await updateDailyLogRequest(token, item.id, { status: 'Solved', repeatDate: '' });
          dispatch(trackerActions.updateDailyLog(item.id, saved));
          return;
        }

        dispatch(trackerActions.markReviewSolved(item));
      },
      async updateNote(topic, value) {
        if (isAuthenticated && token) await updateTopicNote(token, topic, value);
        dispatch(trackerActions.updateNote(topic, value));
      },
      updateSetting: (key, value) => dispatch(trackerActions.updateSetting(key, value)),
      importData: (data) => dispatch(trackerActions.importData(data)),
      resetData: (data) => dispatch(trackerActions.resetData(data))
    }),
    [isAuthenticated, token]
  );

  return (
    <TrackerStateContext.Provider value={state}>
      <TrackerDispatchContext.Provider value={actions}>
        {children}
      </TrackerDispatchContext.Provider>
    </TrackerStateContext.Provider>
  );
}

export function useTrackerState() {
  const context = useContext(TrackerStateContext);
  if (!context) throw new Error('useTrackerState must be used inside TrackerProvider');
  return context;
}

export function useTrackerActions() {
  const context = useContext(TrackerDispatchContext);
  if (!context) throw new Error('useTrackerActions must be used inside TrackerProvider');
  return context;
}
