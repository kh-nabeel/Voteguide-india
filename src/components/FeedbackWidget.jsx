/**
 * FeedbackWidget.jsx
 * Star-rating feedback form. On submit, calls the /api/feedback endpoint
 * which logs the entry to Google Cloud Logging (structured JSON on stdout).
 * Also fires a GA4 'feedback_submitted' event via the useAnalytics hook.
 */

import React, { useState } from 'react';
import { useFeedback }   from '../hooks/useGoogleServices.js';
import { useAnalytics }  from '../hooks/useGoogleServices.js';

const STARS = [1, 2, 3, 4, 5];

/**
 * @param {{ page: string }} props  — identifies which page the widget is on
 */
export default function FeedbackWidget({ page }) {
  const [hovered,   setHovered]   = useState(0);
  const [selected,  setSelected]  = useState(0);
  const [comment,   setComment]   = useState('');
  const [status,    setStatus]    = useState('idle'); // idle | loading | success | error
  const [message,   setMessage]   = useState('');

  const { submitFeedback } = useFeedback();
  const { trackEvent }     = useAnalytics();

  const handleSubmit = async () => {
    if (!selected) return;
    setStatus('loading');

    const result = await submitFeedback({ rating: selected, comment, page });

    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'Thank you for your feedback!');
      trackEvent('feedback_submitted', { rating: selected, page });
    } else {
      setStatus('error');
      setMessage(result.error || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="feedback-widget" aria-live="polite">
        <div className="feedback-success" role="status">
          ✅ {message}
        </div>
      </div>
    );
  }

  return (
    <section className="feedback-widget" aria-label="Page feedback">
      <h3>Was this page helpful?</h3>
      <p>Rate this page to help us improve VoteGuide India.</p>

      {/* Star rating */}
      <div
        className="star-row"
        role="radiogroup"
        aria-label="Star rating from 1 to 5"
      >
        {STARS.map((star) => (
          <button
            key={star}
            className={`star-btn${(hovered || selected) >= star ? ' star-btn--active' : ''}`}
            onClick={() => setSelected(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            aria-pressed={selected === star}
          >
            ★
          </button>
        ))}
      </div>

      {/* Optional comment */}
      <textarea
        className="feedback-textarea"
        placeholder="Optional: Tell us more (max 300 characters)…"
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 300))}
        aria-label="Optional feedback comment"
        rows={3}
      />

      {/* Error message */}
      {status === 'error' && (
        <p style={{ color: 'var(--c-red)', fontSize: '14px', marginBottom: '8px' }}
           role="alert">
          ⚠️ {message}
        </p>
      )}

      <button
        className="btn btn--primary"
        onClick={handleSubmit}
        disabled={!selected || status === 'loading'}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? 'Submitting…' : 'Submit Feedback'}
      </button>
    </section>
  );
}
