/**
 * HomePage.jsx
 * Landing page — hero, stats bar, feature navigation cards,
 * 7-step visual overview, and voter quick-tips.
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

          <div
            style={{
              display: 'flex', alignItems: 'center',
              overflowX: 'auto', gap: 0, paddingBottom: '8px',
            }}
          >
            {STEP_OVERVIEW.map(({ step, icon, label }, i) => (
              <Fragment key={step}>
                <button
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', minWidth: '96px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px',
                  }}
                  onClick={() => navigate('process')}
                  aria-label={`Step ${step}: ${label}`}
                >
                  <div
                    style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: 'var(--c-blue)', color: 'white',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 24,
                      border: '3px solid var(--c-saffron)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                  <span
                    style={{
                      fontSize: '11px', fontWeight: 700,
                      color: 'var(--c-blue)', marginTop: 5,
                      textTransform: 'uppercase', fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Step {step}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--c-text-sec)', textAlign: 'center' }}>
                    {label}
                  </span>
                </button>

                {i < STEP_OVERVIEW.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{ color: 'var(--c-orange)', fontSize: 22, fontWeight: 700, padding: '0 2px', flexShrink: 0 }}
                  >
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
