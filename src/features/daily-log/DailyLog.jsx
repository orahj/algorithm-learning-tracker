import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Filters } from '../../components/ui/Filters';
import { Input, Select, TextArea } from '../../components/ui/FormControls';
import { PageTitle } from '../../components/ui/PageTitle';
import { difficulties, languages, platforms, statuses, topics } from '../../data/options';
import { createEmptyDailyLog } from '../../data/seedData';
import { useTrackerActions, useTrackerState } from '../../state/TrackerProvider';
import { applyFilters, createEmptyFilters } from '../../utils/filters';
import { LogTable } from './LogTable';

export function DailyLog() {
  const data = useTrackerState();
  const { addDailyLog, removeDailyLog } = useTrackerActions();
  const [form, setForm] = useState(createEmptyDailyLog());
  const [filters, setFilters] = useState(createEmptyFilters());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const logs = applyFilters(data.dailyLogs, filters);

  async function submit(event) {
    event.preventDefault();
    if (!form.problemName.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      await addDailyLog(form);
      setForm(createEmptyDailyLog());
    } catch (err) {
      setError(err.message || 'Could not add practice log');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <PageTitle title="Daily Practice Log" subtitle="Capture the 1-hour session, the mistake, the pattern, and whether it needs a repeat." />
      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <Input label="Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} />
          <Select label="Language" value={form.language} options={languages} onChange={(value) => setForm({ ...form, language: value })} />
          <Select label="Topic" value={form.topic} options={topics} onChange={(value) => setForm({ ...form, topic: value })} />
          <Input label="Problem name" value={form.problemName} onChange={(value) => setForm({ ...form, problemName: value })} />
          <Select label="Platform" value={form.platform} options={platforms} onChange={(value) => setForm({ ...form, platform: value })} />
          <Select label="Difficulty" value={form.difficulty} options={difficulties} onChange={(value) => setForm({ ...form, difficulty: value })} />
          <Select label="Status" value={form.status} options={statuses} onChange={(value) => setForm({ ...form, status: value })} />
          <Input label="Time spent" type="number" value={form.timeSpent} onChange={(value) => setForm({ ...form, timeSpent: value })} />
          <Input label="Repeat date" type="date" value={form.repeatDate} onChange={(value) => setForm({ ...form, repeatDate: value })} />
        </div>
        <TextArea label="Mistake made" value={form.mistakeMade} onChange={(value) => setForm({ ...form, mistakeMade: value })} />
        <TextArea label="Pattern learned" value={form.patternLearned} onChange={(value) => setForm({ ...form, patternLearned: value })} />
        <TextArea label="Notes" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} />
        {error && <p className="auth-error">{error}</p>}
        <button className="primary" disabled={submitting}><Plus size={18} /> {submitting ? 'Adding...' : 'Add practice log'}</button>
      </form>

      <Filters filters={filters} setFilters={setFilters} />
      <LogTable logs={logs} remove={removeDailyLog} />
    </section>
  );
}
