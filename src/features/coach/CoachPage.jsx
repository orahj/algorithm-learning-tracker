import { useState } from 'react';
import { BrainCircuit, Check, ExternalLink, Loader2, Send } from 'lucide-react';
import { Input, Select, TextArea } from '../../components/ui/FormControls';
import { PageTitle } from '../../components/ui/PageTitle';
import { pricingTiers } from '../../data/pricingTiers';
import { createCheckoutSession } from '../../services/billingApi';
import { explainProblem } from '../../services/coachApi';
import { useAuth } from '../../state/AuthProvider';

const initialForm = {
  problemName: 'Two Sum',
  topic: 'HashMap',
  language: 'JavaScript',
  difficulty: 'Easy',
  mode: 'explain',
  userApproach: '',
  code: '',
  question: 'Why does the hashmap approach work?'
};

export function CoachPage() {
  const { token, user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [answer, setAnswer] = useState('');
  const [usage, setUsage] = useState(null);
  const [message, setMessage] = useState('');
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState('');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleExplain(event) {
    event.preventDefault();
    setMessage('');
    setLoadingCoach(true);
    try {
      const response = await explainProblem(token, form);
      setAnswer(response.answer);
      setUsage(response.usage);
      if (response.mock) {
        setMessage('Mock coach is active because OPENAI_API_KEY is not configured yet.');
      }
    } catch (error) {
      setMessage(error.message || 'Unable to get coach response.');
    } finally {
      setLoadingCoach(false);
    }
  }

  async function handleCheckout(plan) {
    setMessage('');
    setLoadingPlan(plan);
    try {
      const response = await createCheckoutSession(token, plan);
      window.location.href = response.url;
    } catch (error) {
      setMessage(error.message || 'Unable to start checkout.');
    } finally {
      setLoadingPlan('');
    }
  }

  const paidTiers = pricingTiers.filter((tier) => tier.id !== 'free');

  return (
    <section className="page">
      <PageTitle
        title="AI Coach"
        subtitle="Test explanations, hints, and mistake reviews. Local development uses mock coaching until OpenAI is configured."
      />

      <div className="coach-dashboard">
        <div className="form-card coach-panel">
          <div className="coach-panel-header">
            <div className="stat-icon"><BrainCircuit size={22} /></div>
            <div>
              <h3>Ask the coach</h3>
              <p className="muted">Current plan: <strong>{user?.plan || 'free'}</strong></p>
            </div>
          </div>

          <form onSubmit={handleExplain}>
            <div className="form-grid">
              <Input label="Problem" value={form.problemName} onChange={(value) => updateField('problemName', value)} />
              <Input label="Topic" value={form.topic} onChange={(value) => updateField('topic', value)} />
              <Select label="Language" value={form.language} onChange={(value) => updateField('language', value)} options={['JavaScript', 'Python', 'C#', 'Java']} />
              <Select label="Difficulty" value={form.difficulty} onChange={(value) => updateField('difficulty', value)} options={['Easy', 'Medium', 'Hard']} />
            </div>
            <Select label="Coach mode" value={form.mode} onChange={(value) => updateField('mode', value)} options={['explain', 'hint', 'mistake_review']} />
            <TextArea label="Your approach" value={form.userApproach} onChange={(value) => updateField('userApproach', value)} />
            <TextArea label="Code or notes" value={form.code} onChange={(value) => updateField('code', value)} />
            <TextArea label="Question" value={form.question} onChange={(value) => updateField('question', value)} />
            <button className="primary" disabled={loadingCoach}>
              {loadingCoach ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
              Explain this problem
            </button>
          </form>
        </div>

        <div className="coach-side">
          <div className="form-card">
            <h3>Usage</h3>
            <p className="muted">
              {usage ? `${usage.used} of ${usage.limit} coach credits used for ${usage.period}.` : 'Run your first explanation to see usage.'}
            </p>
            {message && <p className="notice-text">{message}</p>}
          </div>

          <div className="form-card">
            <h3>Upgrade plans</h3>
            <div className="mini-plan-list">
              {paidTiers.map((tier) => (
                <div className="mini-plan" key={tier.id}>
                  <div>
                    <strong>{tier.name}</strong>
                    <span>{tier.price} {tier.interval}</span>
                  </div>
                  <button className="ghost" onClick={() => handleCheckout(tier.id)} disabled={Boolean(loadingPlan)}>
                    {loadingPlan === tier.id ? <Loader2 size={16} className="spin" /> : <ExternalLink size={16} />}
                    Paystack
                  </button>
                </div>
              ))}
            </div>
            <p className="small-note">Checkout works when Paystack env values are configured. Stripe remains available as a later fallback.</p>
          </div>
        </div>
      </div>

      {answer && (
        <div className="coach-answer">
          <div className="coach-answer-title">
            <Check size={18} />
            <h3>Coach response</h3>
          </div>
          <pre>{answer}</pre>
        </div>
      )}
    </section>
  );
}
