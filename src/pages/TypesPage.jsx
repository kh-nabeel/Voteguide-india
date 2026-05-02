/**
 * TypesPage.jsx
 * Explains the three main types of Indian elections with comparison table.
 */

import React from 'react';
import { ELECTION_TYPES } from '../data/electionData.js';
import FeedbackWidget     from '../components/FeedbackWidget.jsx';

const COMPARISON_ROWS = [
  ['Level',               'Central / National', 'Central / National', 'State'],
  ['Who Votes',           'All registered citizens (18+)', 'Elected MLAs of each state', 'All registered citizens (18+)'],
  ['Election Type',       'Direct',  'Indirect', 'Direct'],
  ['Min. Age to Contest', '25 years', '30 years', '25 years'],
  ['Term Duration',       '5 years',  '6 years',  '5 years'],
  ['Can be Dissolved?',   'Yes — by President', 'No (Permanent House)', 'Yes — by Governor'],
  ['Head of Government',  'Prime Minister',     '—',                   'Chief Minister'],
  ['Managed by',          'ECI',               'ECI',                  'ECI'],
];

export default function TypesPage() {
  return (
    <div className="page">
      <h1 className="page__title">Types of Elections in India</h1>
      <p className="page__lead">
        India holds elections at multiple levels — national and state. Here are
        the three main types every citizen should know.
      </p>

      {/* ── Type Cards ── */}
      {ELECTION_TYPES.map((type) => (
        <article key={type.id} className="type-card" aria-label={`${type.name} elections`}>

          <div
            className="type-card__header"
            style={{ background: `linear-gradient(135deg, ${type.color}DD, ${type.color})` }}
          >
            <div className="type-card__icon" aria-hidden="true">{type.icon}</div>
            <div>
              <h2>{type.name}</h2>
              <div className="sub">{type.subtitle}</div>
            </div>
          </div>

          <div className="type-card__body">
            <p>{type.description}</p>

            <div className="meta-pills">
              <span className="meta-pill">🪑 Seats: {type.seats}</span>
              <span className="meta-pill">📅 Term: {type.term}</span>
              <span className="meta-pill">🗳️ Voter: {type.voterAge}</span>
              <span className="meta-pill">👤 Candidate: {type.contestAge}</span>
            </div>

            <h3
              style={{
                fontSize: 'var(--size-sm)', color: 'var(--c-text-muted)',
                fontWeight: 700, marginBottom: '8px',
              }}
            >
              Key Facts:
            </h3>
            <ul className="fact-list">
              {type.keyFacts.map((fact, i) => <li key={i}>{fact}</li>)}
            </ul>
          </div>

        </article>
      ))}

      {/* ── Comparison Table ── */}
      <section style={{ marginTop: '32px' }} aria-label="Comparison table">
        <h2
          style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--size-2xl)',
            color: 'var(--c-blue)',
            borderLeft: '5px solid var(--c-orange)', paddingLeft: '16px',
            marginBottom: '20px',
          }}
        >
          Quick Comparison
        </h2>

        <div className="data-table-wrap">
          <table className="data-table">
            <caption>Comparison of Lok Sabha, Rajya Sabha, and Vidhan Sabha elections</caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Lok Sabha</th>
                <th scope="col">Rajya Sabha</th>
                <th scope="col">Vidhan Sabha</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map(([feature, lok, rajya, vidhan]) => (
                <tr key={feature}>
                  <td>{feature}</td>
                  <td>{lok}</td>
                  <td>{rajya}</td>
                  <td>{vidhan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Local Elections Note ── */}
      <section style={{ marginTop: '28px' }} aria-label="Local elections note">
        <div className="info-box info-box--green">
          <strong>🏘️ Also Important: Local Body Elections</strong>
          <p style={{ marginTop: '6px' }}>
            India also holds elections for Panchayats (village level) and Municipal
            Corporations / Councils (city level). These are managed by State Election
            Commissions (not the ECI) and elect representatives who handle local
            governance, roads, water, and sanitation.
          </p>
        </div>
      </section>

      <FeedbackWidget page="types" />
    </div>
  );
}
