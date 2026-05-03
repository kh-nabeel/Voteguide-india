/**
 * HomePage.jsx
 * 
 * WHY THIS EXISTS:
 * Serves as the primary landing hub. It is designed to immediately orient the user 
 * with a high-level visual overview of the electoral process, key statistics, and 
 * clear feature navigation. The architecture separates the heavy data components 
 * (like the Chat or Map) from this view to ensure near-instant initial load times 
 * (Critical Rendering Path optimization), which is essential for accessibility in 
 * low-bandwidth areas of India.
 */

import { Fragment } from 'react';
import PropTypes          from 'prop-types';
import { useAnalytics } from '../hooks/useGoogleServices.js';

const FEATURES = [
  {
    key:  'process',
    icon: '📋',
    title: 'Election Process',
    desc:  'Step-by-step guide to all 7 stages of how Indian elections work.',
  },
  {
    key:  'types',
    icon: '🏛️',
    title: 'Types of Elections',
    desc:  'Understand Lok Sabha, Rajya Sabha, and Vidhan Sabha elections clearly.',
  },
  {
    key:  'map',
    icon: '🗺️',
    title: 'ECI Office Locator',
    desc:  'Find the Chief Electoral Officer office in your state on Google Maps.',
  },
  {
    key:  'chat',
    icon: '🤖',
    title: 'Ask the Guide',
    desc:  'Gemini-powered AI chatbot answers your election questions in plain English.',
  },
  {
    key:  'faq',
    icon: '❓',
    title: 'Common Questions',
    desc:  'Voter registration, EVM safety, NOTA, MCC — all explained simply.',
  },
];

const STEP_OVERVIEW = [
  { step: 1, icon: '📢', label: 'Announcement' },
  { step: 2, icon: '📋', label: 'Registration' },
  { step: 3, icon: '📝', label: 'Nominations' },
  { step: 4, icon: '🗣️', label: 'Campaign' },
  { step: 5, icon: '🗳️', label: 'Voting' },
  { step: 6, icon: '🔢', label: 'Counting' },
  { step: 7, icon: '🏛️', label: 'Govt. Formation' },
];

const VOTER_TIPS = [
  { icon: '✅', text: 'Check your name in the Voter List before election day' },
  { icon: '📱', text: 'Download the Voter Helpline App to find your booth' },
  { icon: '🗳️', text: 'Bring your Voter ID or any approved photo ID to vote' },
  { icon: '📢', text: 'Report MCC violations to ECI on Helpline 1950' },
];

/** @param {{ navigate: (page: string) => void }} props */
export default function HomePage({ navigate }) {
  const { trackEvent } = useAnalytics();

  const handleFeatureClick = (key) => {
    trackEvent('feature_card_click', { feature: key });
    navigate(key);
  };

  return (
    <>
      {/* ── Alert Banner ── */}
      <div className="alert-banner" role="alert">
        <strong>📢 Important:</strong> Always verify election information on the official{' '}
        <a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer">
          ECI website
        </a>{' '}
        or call Helpline <strong>1950</strong> (toll-free).
      </div>

      {/* ── Hero ── */}
      <section className="hero" aria-label="Welcome">
        <div className="hero__inner">
          <div className="hero__badge">🗳️ World&apos;s Largest Democracy</div>
          <h2>Understand India&apos;s Election Process</h2>
          <p className="hero__sub">
            Your complete, plain-English guide to Indian elections — from voter
            registration to government formation. Simple enough for every citizen.
          </p>
          <div className="hero__actions">
            <button
              className="btn btn--primary"
              onClick={() => handleFeatureClick('process')}
            >
              📋 Explore Election Steps
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => handleFeatureClick('chat')}
            >
              🤖 Ask the AI Guide
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="stats-bar" role="region" aria-label="Election statistics">
        {[
          { number: '97 Cr+', label: 'Registered Voters' },
          { number: '543',    label: 'Lok Sabha Seats' },
          { number: '10.5L+', label: 'Polling Stations' },
          { number: '5 Yrs',  label: 'Election Cycle' },
        ].map(({ number, label }) => (
          <div className="stat" key={label}>
            <span className="stat__number">{number}</span>
            <span className="stat__label">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="page">

        {/* Feature Cards */}
        <section aria-label="Site features">
          <div className="section-heading">
            <h2>What Would You Like to Learn?</h2>
            <div className="section-heading__bar" />
            <p>Choose a topic to get started</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map(({ key, icon, title, desc }) => (
              <button
                key={key}
                className="feature-card"
                onClick={() => handleFeatureClick(key)}
                aria-label={`Open ${title}`}
              >
                <div className="feature-card__icon" aria-hidden="true">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 7-Step Visual Overview */}
        <section style={{ marginTop: '40px' }} aria-label="Election process overview">
          <div className="section-heading">
            <h2>The 7 Steps of Indian Elections</h2>
            <div className="section-heading__bar" />
            <p>A quick visual overview — click any step to learn more</p>
          </div>

          <div className="step-overview">
            {STEP_OVERVIEW.map(({ step, icon, label }, i) => (
              <Fragment key={step}>
                <button
                  className="step-overview__btn"
                  onClick={() => navigate('process')}
                  aria-label={`Step ${step}: ${label}`}
                >
                  <div
                    className="step-overview__bubble"
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                  <span className="step-overview__title">
                    Step {step}
                  </span>
                  <span className="step-overview__label">
                    {label}
                  </span>
                </button>

                {i < STEP_OVERVIEW.length - 1 && (
                  <span className="step-overview__arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </Fragment>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              className="btn btn--secondary"
              onClick={() => navigate('process')}
            >
              Learn Each Step in Detail →
            </button>
          </div>
        </section>

        {/* Voter Quick Tips */}
        <section style={{ marginTop: '40px' }} aria-label="Voter quick tips">
          <div className="card" style={{ padding: '24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)', fontSize: 'var(--size-xl)',
                color: 'var(--c-blue)', marginBottom: '16px',
              }}
            >
              🗳️ Quick Voter Tips
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {VOTER_TIPS.map(({ icon, text }) => (
                <div
                  key={text}
                  className="info-box info-box--blue"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <span aria-hidden="true" style={{ fontSize: '22px', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

HomePage.propTypes = {
  /** Callback to navigate to a given page key */
  navigate: PropTypes.func.isRequired,
};
