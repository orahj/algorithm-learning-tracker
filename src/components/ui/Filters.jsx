import { Search } from 'lucide-react';
import { difficulties, languages, statuses, topics } from '../../data/options';
import { createEmptyFilters } from '../../utils/filters';

export function Filters({ filters, setFilters, includeDates = true }) {
  return (
    <div className="filters">
      <div className="search-wrap">
        <Search size={16} />
        <input
          placeholder="Search..."
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
        />
      </div>
      <select value={filters.language} onChange={(event) => setFilters({ ...filters, language: event.target.value })}>
        <option value="">All languages</option>
        {languages.map((language) => <option key={language}>{language}</option>)}
      </select>
      <select value={filters.topic} onChange={(event) => setFilters({ ...filters, topic: event.target.value })}>
        <option value="">All topics</option>
        {topics.map((topic) => <option key={topic}>{topic}</option>)}
      </select>
      <select value={filters.difficulty} onChange={(event) => setFilters({ ...filters, difficulty: event.target.value })}>
        <option value="">All difficulty</option>
        {difficulties.map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
      </select>
      <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
        <option value="">All status</option>
        {statuses.map((status) => <option key={status}>{status}</option>)}
      </select>
      {includeDates && <input type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} />}
      {includeDates && <input type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} />}
      <button className="ghost" onClick={() => setFilters(createEmptyFilters())}>Reset</button>
    </div>
  );
}
