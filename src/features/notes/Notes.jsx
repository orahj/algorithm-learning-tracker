import { useState } from 'react';
import { PageTitle } from '../../components/ui/PageTitle';
import { topics } from '../../data/options';
import { useTrackerActions, useTrackerState } from '../../state/TrackerProvider';

export function Notes() {
  const data = useTrackerState();
  const { updateNote } = useTrackerActions();
  const [activeTopic, setActiveTopic] = useState(topics[0]);

  return (
    <section className="page">
      <PageTitle title="Topic Notes" subtitle="Keep your personal explanations, patterns, edge cases, and code reminders by topic." />
      <div className="notes-layout">
        <div className="topic-list">
          {topics.map((topic) => (
            <button key={topic} className={activeTopic === topic ? 'active' : ''} onClick={() => setActiveTopic(topic)}>
              {topic}
            </button>
          ))}
        </div>
        <div className="note-editor">
          <h3>{activeTopic}</h3>
          <textarea
            value={data.notes[activeTopic] || ''}
            onChange={(event) => updateNote(activeTopic, event.target.value)}
            placeholder="Write what you learned, common mistakes, patterns, edge cases, and example snippets..."
          />
        </div>
      </div>
    </section>
  );
}
