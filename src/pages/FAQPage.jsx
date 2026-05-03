/**
 * FAQPage.jsx
 * Accordion-style FAQ page with voter eligibility checker and
 * registration steps. GA4 tracks which questions users expand.
 */

import { useState } from 'react';
import { FAQS }          from '../data/electionData.js';
import FeedbackWidget    from '../components/FeedbackWidget.jsx';
import { useAnalytics }  from '../hooks/useGoogleServices.js';

const REGISTRATION_STEPS = [
  {
    n: 1, icon: '💻', title: 'Online',
    desc: 'Visit voters.eci.gov.in or the Voter Helpline App. Fill Form 6 for new registration. Completely free.',
  },
  {
    n: 2, icon: '🏢', title: 'Offline',
    desc: 'Visit your local Booth Level Officer (BLO) or Electoral Registration Officer (ERO) with physical documents.',
  },
  {
    n: 3, icon: '📄', title: 'Documents Needed',
    desc: 'Age proof (birth certificate or school certificate), address proof (Aadhaar or utility bill), and a passport-size photo.',
  },
  {
    n: 4, icon: '📬', title: 'After Applying',
    desc: 'Your details are verified and added to the Electoral Roll. Your Voter ID card (EPIC) is sent to your registered address.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const { trackEvent } = useAnalytics();

  const toggleFaq = (index) => {
    const next = openIndex === index ? null : index;
    setOpenIndex(next);
    if (next !== null) {
      trackEvent('faq_opened', { question_index: index });
    }
  };

  return (
    <div className="page">
      <h1 className="page__title">Frequently Asked Questions</h1>
      <p className="page__lead">
        Quick, plain-English answers to the most common questions about Indian elections.
      </p>

      {/* ── FAQ Accordion ── */}
      <section aria-label="FAQ list">
        {FAQS.map((faq, i) => (
          <div key={i} className="faq-item">
            <button
              className="faq-item__btn"
              onClick={() => toggleFaq(i)}
              aria-expanded={openIndex === i}
              aria-controls={`faq-answer-${i}`}
            >
              <span>{faq.q}</span>
              <span aria-hidden="true" style={{ fontSize: '18px', flexShrink: 0 }}>
                {openIndex === i ? '▲' : '▼'}
              </span>
            </button>
            {openIndex === i && (
              <div
                id={`faq-answer-${i}`}
                className="faq-item__answer"
                role="region"
                aria-label={`Answer to: ${faq.q}`}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ── Voter Eligibility ── */}
      <section style={{ marginTop: '40px' }} aria-label="Voter eligibility">
        <h2
          style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--size-2xl)',
            color: 'var(--c-blue)',
            borderLeft: '5px solid var(--c-orange)', paddingLeft: '16px',
            marginBottom: '20px',
          }}
        >
          Am I Eligible to Vote?
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Eligible */}
          <div
            className="info-box info-box--green"
            role="region"
            aria-label="Eligible voters"
          >
            <strong style={{ fontSize: '15px', display: 'block', marginBottom: '8px' }}>
              ✅ You ARE eligible if:
            </strong>
            <ul style={{ paddingLeft: '18px' }}>
              {['Indian citizen', 'Aged 18 years or above', 'Registered on the Electoral Roll', 'Not legally disqualified'].map((item) => (
                <li key={item} style={{ marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Not eligible */}
          <div
            className="info-box info-box--red"
            role="region"
            aria-label="Ineligible voters"
          >
            <strong style={{ fontSize: '15px', display: 'block', marginBottom: '8px' }}>
              ❌ You are NOT eligible if:
            </strong>
            <ul style={{ paddingLeft: '18px' }}>
              {[
                'Non-Indian citizen',
                'Under 18 years of age',
                'Not registered on Electoral Roll',
                'Declared of unsound mind by a court',
                'Serving a criminal sentence of 2+ years',
              ].map((item) => (
                <li key={item} style={{ marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── How to Register ── */}
      <section style={{ marginTop: '40px' }} aria-label="How to register">
        <h2
          style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--size-2xl)',
            color: 'var(--c-blue)',
            borderLeft: '5px solid var(--c-orange)', paddingLeft: '16px',
            marginBottom: '20px',
          }}
        >
          How to Register as a Voter
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '16px',
          }}
        >
          {REGISTRATION_STEPS.map(({ n, icon, title, desc }) => (
            <div key={n} className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }} aria-hidden="true">
                {icon}
              </div>
              <div
                style={{
                  fontSize: 'var(--size-xs)', fontWeight: 700,
                  color: 'var(--c-orange)', textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Step {n}
              </div>
              <h3 style={{ fontSize: 'var(--size-base)', color: 'var(--c-blue)', margin: '4px 0' }}>
                {title}
              </h3>
              <p style={{ fontSize: 'var(--size-sm)', color: 'var(--c-text-sec)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Box ── */}
      <section style={{ marginTop: '28px' }} aria-label="Contact information">
        <div className="info-box info-box--blue">
          <strong>📞 Contact the Election Commission of India</strong>
          <div
            style={{
              display: 'flex', gap: '24px', flexWrap: 'wrap',
              marginTop: '8px', fontSize: 'var(--size-sm)',
            }}
          >
            <span>🔢 <strong>Helpline:</strong> 1950 (Toll-Free)</span>
            <span>🌐 <strong>Website:</strong> www.eci.gov.in</span>
            <span>📱 <strong>App:</strong> Voter Helpline App</span>
            <span>✉️ <strong>Email:</strong> complaints@eci.gov.in</span>
          </div>
        </div>
      </section>

      <FeedbackWidget page="faq" />
    </div>
  );
}
