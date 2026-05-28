import { Download, Trash2, Upload } from 'lucide-react';
import { Input } from '../../components/ui/FormControls';
import { PageTitle } from '../../components/ui/PageTitle';
import { resetTrackerStorage } from '../../services/trackerStorage';
import { useTrackerActions, useTrackerState } from '../../state/TrackerProvider';
import { todayIso } from '../../utils/date';

export function SettingsPage() {
  const data = useTrackerState();
  const { importData, resetData, updateSetting } = useTrackerActions();

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `algorithm-tracker-backup-${todayIso()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(JSON.parse(reader.result));
      } catch {
        alert('Invalid JSON file. Please import a valid tracker backup.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function handleResetData() {
    if (!confirm('Reset all tracker data? This cannot be undone unless you exported a backup.')) return;
    resetData(resetTrackerStorage());
  }

  return (
    <section className="page">
      <PageTitle title="Settings & Backup" subtitle="Control your plan start date, target practice minutes, and localStorage backup." />
      <div className="settings-grid">
        <div className="form-card">
          <h3>Plan settings</h3>
          <Input label="Plan start date" type="date" value={data.planStartDate} onChange={(value) => updateSetting('planStartDate', value)} />
          <Input label="Daily target minutes" type="number" value={data.targetDailyMinutes} onChange={(value) => updateSetting('targetDailyMinutes', Number(value))} />
        </div>
        <div className="form-card">
          <h3>Backup</h3>
          <p className="muted">Your data is stored only inside this browser using localStorage. Export JSON regularly if you want a backup.</p>
          <div className="button-row">
            <button className="primary" onClick={exportJson}><Download size={18} /> Export JSON</button>
            <label className="ghost file-button"><Upload size={18} /> Import JSON<input type="file" accept="application/json" onChange={importJson} /></label>
            <button className="danger" onClick={handleResetData}><Trash2 size={18} /> Reset</button>
          </div>
        </div>
      </div>
    </section>
  );
}
