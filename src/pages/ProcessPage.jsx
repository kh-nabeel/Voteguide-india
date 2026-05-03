/**
 * ProcessPage.jsx
 * Renders the interactive 7-step Indian election process guide.
 * Each step can be expanded to reveal detailed bullet points and a
 * "Know More" fact box. Tracks expansions in GA4.
 */

import { useState } from 'react';
import { ELECTION_STEPS }  from '../data/electionData.js';
import FeedbackWidget      from '../components/FeedbackWidget.jsx';
import { useAnalytics }    from '../hooks/useGoogleServices.js';

const EVM_STEPS = [
  { n: 1, icon: '🪪', title: 'Show Your ID',   desc: 'Present Voter ID or any approved photo ID to the Presiding Officer.' },
  { n: 2, icon: '✋', title: 'Ink Marking',    desc: 'Indelible ink is applied on your left index finger to prevent double voting.' },
  { n: 3, icon: '🗳️', title: 'Enter Booth',   desc: 'Go alone into the voting compartment to ensure a secret ballot.' },
  { n: 4, icon: '🔘', title: 'Press Button',   desc: "Press the button next to your chosen candidate's name and party symbol on the EVM." },
  { n: 5, icon: '📄', title: 'VVPAT Slip',     desc: 'A paper slip appears for 7 seconds showing your vote — verify it carefully.' },
  { n: 6, icon: '✅', title: 'Vote Recorded',  desc: 'A beep confirms your vote is recorded. Leave the booth; your vote is completely secret.' },
];

export default function ProcessPage() {
  const [openStepId, setOpenStepId] = useState(null);
  const { trackEvent } = useAnalytics();

  const toggleStep = (id) => {
    const nextId = openStepId === id ? null : id;
    setOpenStepId(nextId);
    if (nextId) {
      trackEvent('election_step_expanded', { step_id: id });
    }
  };

  return (
    <div className="page">
      <h1 className="page__title">The Indian Election Process</h1>
      <p className="page__lead">
        Elections in India happen in a structured, transparent process managed by
        the Election Commission of India (ECI). Here are the 7 main stages —
        click any step to expand full details.
      </p>

      <div className="info-box info-box--blue" style={{ marginBottom: '24px' }}>
        <strong>💡 Did you know?</strong> The Election Commission of India was established
        on January 25, 1950 — the day before India became a Republic. Article 324 of the
        Constitution gives the ECI full authority to superintend, direct, and control
        all elections to Parliament and State Legislatures.
      </div>

      {/* ── Steps ── */}
      <ol
        style={{ listStyle: 'none' }}
        aria-label="Election process steps"
      >
        {ELECTION_STEPS.map((step, index) => {
          const isOpen = openStepId === step.id;
          const isLast = index === ELECTION_STEPS.length - 1;

          return (
            <li key={step.id} className="step-item">

              {/* Track + connector line */}
              <div className="step-item__track" aria-hidden="true">
                <div
                  className="step-item__bubble"
                  style={{ background: step.color }}
                  title={step.title}
                >
                  {step.icon}
                </div>
                {!isLast && <div className="step-item__line" />}
              </div>

              {/* Content card */}
              <div
                className={`step-item__body${isOpen ? ' step-item__body--open' : ''}`}
                style={isOpen ? { borderLeftColor: step.color } : undefined}
              >
                {/* Header row */}
                <div className="step-item__header">
                  <div>
                    <h2>Step {step.id}: {step.title}</h2>
                    <p>{step.subtitle}</p>
                  </div>
                  <button
                    className="step-item__toggle"
                    onClick={() => toggleStep(step.id)}
                    aria-expanded={isOpen}
                    aria-controls={`step-details-${step.id}`}
                    aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${step.title}`}
                  >
                    {isOpen ? '−' : '+'}
                  </button>
                </div>

                <p className="step-item__desc">{step.description}</p>

                {/* Expandable details */}
                {isOpen && (
                  <div
                    id={`step-details-${step.id}`}
                    className="step-item__details"
                    role="region"
                    aria-label={`Details for ${step.title}`}
                  >
                    <ul>
                      {step.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                    <div className="learn-box">
                      <strong>📌 Know More:</strong> {step.fact}
                    </div>
                  </div>
                )}
              </div>

            </li>
          );
        })}
      </ol>

      {/* ── How to Use an EVM ── */}
      <section style={{ marginTop: '48px' }} aria-label="How to use an EVM">
        <h2
          style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--size-2xl)',
            color: 'var(--c-blue)',
            borderLeft: '5px solid var(--c-orange)', paddingLeft: '16px',
            marginBottom: '20px',
          }}
        >
          How to Vote Using an EVM
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
            gap: '16px',
          }}
        >
          {EVM_STEPS.map(({ n, icon, title, desc }) => (
            <div key={n} className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '30px', marginBottom: '8px' }} aria-hidden="true">
                {icon}
              </div>
              <div
                style={{
                  background: 'var(--c-orange)', color: 'white',
                  borderRadius: '50%', width: '24px', height: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, margin: '0 auto 8px',
                }}
                aria-hidden="true"
              >
                {n}
              </div>
              <h3 style={{ fontSize: 'var(--size-base)', color: 'var(--c-blue)', marginBottom: '4px' }}>
                {title}
              </h3>
              <p style={{ fontSize: 'var(--size-sm)', color: 'var(--c-text-sec)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MCC Notice ── */}
      <section style={{ marginTop: '32px' }} aria-label="Model Code of Conduct">
        <div className="info-box info-box--orange">
          <strong>📜 Model Code of Conduct — Key Rules:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>Comes into force the moment ECI announces the election schedule</li>
            <li>Government may not announce new schemes or use official machinery for campaigning</li>
            <li>Campaigning stops 48 hours before polling begins (Silent Period)</li>
            <li>Offering cash, gifts, or liquor to voters is a criminal offence under IPC Section 171B</li>
            <li>Violations can be reported to ECI on the toll-free Helpline <strong>1950</strong></li>
          </ul>
        </div>
      </section>

      <FeedbackWidget page="process" />
    </div>
  );
}
