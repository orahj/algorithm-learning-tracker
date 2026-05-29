import { ArrowRight, BrainCircuit, Check, Code2, GraduationCap, Sparkles, Target } from 'lucide-react';
import heroImage from '../../assets/landing-hero.png';
import { pricingTiers } from '../../data/pricingTiers';

const learningLoop = [
  ['Plan', 'Follow a clear 90-day path instead of guessing what to study next.'],
  ['Practice', 'Log problems, topics, time, difficulty, mistakes, and repeat dates.'],
  ['Understand', 'Use AI-guided explanations to learn patterns, not memorize answers.'],
  ['Review', 'Build mastery with spaced repetition and weak-topic feedback.']
];

const aiFeatures = [
  'Step-by-step hints before full solutions',
  'Mistake analysis after failed attempts',
  'Beginner-friendly pattern explanations',
  'Personalized weak-topic practice'
];

export function LandingPage({ onStart, onLogin }) {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="brand-mark"><Code2 size={22} /></div>
          <strong>Algo Command</strong>
        </div>
        <div className="landing-nav-actions">
          <button className="ghost" onClick={onLogin}>Login</button>
          <button className="primary" onClick={onStart}>Start free</button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">AI-guided algorithm learning</span>
          <h1>Learn algorithms with structure, not memorized solutions.</h1>
          <p>
            Start with a free 3-month tracker, then upgrade to an AI coach that explains patterns,
            finds your weak spots, and helps beginners understand the why behind every problem.
          </p>
          <div className="landing-cta-row">
            <button className="primary landing-cta" onClick={onStart}>
              Start the free tracker <ArrowRight size={18} />
            </button>
            <button className="ghost landing-cta" onClick={onLogin}>I already have an account</button>
          </div>
          <div className="landing-proof">
            <span><Check size={16} /> Free 90-day tracker</span>
            <span><Check size={16} /> AI coach ready</span>
            <span><Check size={16} /> Beginner friendly</span>
          </div>
        </div>
        <div className="landing-visual">
          <img src={heroImage} alt="Algo Command learning dashboard preview" />
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <span className="eyebrow">The learning loop</span>
          <h2>Built for people who want to understand the pattern.</h2>
        </div>
        <div className="loop-grid">
          {learningLoop.map(([title, text], index) => (
            <div className="loop-card" key={title}>
              <span>{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="coach-section">
        <div>
          <span className="eyebrow">Paid AI coach</span>
          <h2>Upgrade when tracking is no longer enough.</h2>
          <p>
            The free tracker gives users consistency. The AI coach turns each attempt into a lesson,
            helping beginners reason through patterns like sliding window, recursion, trees, and dynamic programming.
          </p>
        </div>
        <div className="coach-feature-list">
          {aiFeatures.map((feature) => (
            <div key={feature}>
              <Sparkles size={18} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <span className="eyebrow">Pricing direction</span>
          <h2>Start free, grow into coaching.</h2>
        </div>
        <div className="pricing-grid">
          {pricingTiers.map((tier) => (
            <article className={`pricing-card ${tier.featured ? 'featured' : ''}`} key={tier.name}>
              <div className="tier-icon">
                {tier.name === 'Free Tracker' ? <Target size={20} /> : tier.name === 'AI Coach' ? <BrainCircuit size={20} /> : <GraduationCap size={20} />}
              </div>
              <h3>{tier.name}</h3>
              <strong>{tier.price}</strong>
              <small>{tier.interval}</small>
              <p>{tier.description}</p>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}><Check size={16} /> {feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>Begin with the free tracker.</h2>
        <p>Build the habit first. Add the AI coach when you are ready to go deeper.</p>
        <button className="primary landing-cta" onClick={onStart}>Create free account <ArrowRight size={18} /></button>
      </section>
    </main>
  );
}
