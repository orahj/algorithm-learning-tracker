export function applyFilters(items, filters, dateField = 'date') {
  return items.filter((item) => {
    const matchesLanguage = !filters.language || item.language === filters.language;
    const matchesTopic = !filters.topic || item.topic === filters.topic;
    const matchesDifficulty = !filters.difficulty || item.difficulty === filters.difficulty;
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesSearch = !filters.search || JSON.stringify(item).toLowerCase().includes(filters.search.toLowerCase());
    const matchesFrom = !filters.from || item[dateField] >= filters.from;
    const matchesTo = !filters.to || item[dateField] <= filters.to;
    return matchesLanguage && matchesTopic && matchesDifficulty && matchesStatus && matchesSearch && matchesFrom && matchesTo;
  });
}

export function createEmptyFilters() {
  return { language: '', topic: '', difficulty: '', status: '', search: '', from: '', to: '' };
}
