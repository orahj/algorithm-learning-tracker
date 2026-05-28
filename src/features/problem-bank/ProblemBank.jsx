import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Filters } from '../../components/ui/Filters';
import { Input, Select, TextArea } from '../../components/ui/FormControls';
import { PageTitle } from '../../components/ui/PageTitle';
import { difficulties, languages, statuses, topics } from '../../data/options';
import { createEmptyProblem } from '../../data/seedData';
import { useTrackerActions, useTrackerState } from '../../state/TrackerProvider';
import { applyFilters, createEmptyFilters } from '../../utils/filters';
import { ProblemTable } from './ProblemTable';

export function ProblemBank() {
  const data = useTrackerState();
  const { addProblem, removeProblem, updateProblem } = useTrackerActions();
  const [form, setForm] = useState(createEmptyProblem());
  const [filters, setFilters] = useState(createEmptyFilters());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const problems = applyFilters(data.problems, filters, 'lastAttemptedDate');

  async function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      await addProblem(form);
      setForm(createEmptyProblem());
    } catch (err) {
      setError(err.message || 'Could not add problem');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <PageTitle title="Problem Bank" subtitle="Manually build your practice library and keep repeat dates visible." />
      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <Input label="Problem name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Select label="Topic" value={form.topic} options={topics} onChange={(value) => setForm({ ...form, topic: value })} />
          <Select label="Language" value={form.language} options={languages} onChange={(value) => setForm({ ...form, language: value })} />
          <Select label="Difficulty" value={form.difficulty} options={difficulties} onChange={(value) => setForm({ ...form, difficulty: value })} />
          <Input label="Link" value={form.link} onChange={(value) => setForm({ ...form, link: value })} />
          <Select label="Status" value={form.status} options={statuses} onChange={(value) => setForm({ ...form, status: value })} />
          <Input label="Last attempted" type="date" value={form.lastAttemptedDate} onChange={(value) => setForm({ ...form, lastAttemptedDate: value })} />
          <Input label="Repeat date" type="date" value={form.repeatDate} onChange={(value) => setForm({ ...form, repeatDate: value })} />
        </div>
        <TextArea label="Notes" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} />
        {error && <p className="auth-error">{error}</p>}
        <button className="primary" disabled={submitting}><Plus size={18} /> {submitting ? 'Adding...' : 'Add problem'}</button>
      </form>

      <Filters filters={filters} setFilters={setFilters} />
      <ProblemTable problems={problems} remove={removeProblem} updateProblem={updateProblem} />
    </section>
  );
}
