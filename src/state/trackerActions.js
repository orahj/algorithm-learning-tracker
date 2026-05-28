export const trackerActionTypes = {
  loadFromServer: 'tracker/loadFromServer',
  addDailyLog: 'tracker/addDailyLog',
  updateDailyLog: 'tracker/updateDailyLog',
  removeDailyLog: 'tracker/removeDailyLog',
  addProblem: 'tracker/addProblem',
  updateProblem: 'tracker/updateProblem',
  removeProblem: 'tracker/removeProblem',
  markReviewSolved: 'tracker/markReviewSolved',
  updateNote: 'tracker/updateNote',
  updateSetting: 'tracker/updateSetting',
  importData: 'tracker/importData',
  resetData: 'tracker/resetData'
};

export const trackerActions = {
  loadFromServer: (data) => ({ type: trackerActionTypes.loadFromServer, payload: data }),
  addDailyLog: (log) => ({ type: trackerActionTypes.addDailyLog, payload: log }),
  updateDailyLog: (id, patch) => ({ type: trackerActionTypes.updateDailyLog, payload: { id, patch } }),
  removeDailyLog: (id) => ({ type: trackerActionTypes.removeDailyLog, payload: id }),
  addProblem: (problem) => ({ type: trackerActionTypes.addProblem, payload: problem }),
  updateProblem: (id, patch) => ({ type: trackerActionTypes.updateProblem, payload: { id, patch } }),
  removeProblem: (id) => ({ type: trackerActionTypes.removeProblem, payload: id }),
  markReviewSolved: (item) => ({ type: trackerActionTypes.markReviewSolved, payload: item }),
  updateNote: (topic, value) => ({ type: trackerActionTypes.updateNote, payload: { topic, value } }),
  updateSetting: (key, value) => ({ type: trackerActionTypes.updateSetting, payload: { key, value } }),
  importData: (data) => ({ type: trackerActionTypes.importData, payload: data }),
  resetData: (data) => ({ type: trackerActionTypes.resetData, payload: data })
};
