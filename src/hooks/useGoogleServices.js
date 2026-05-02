/**
 * useGoogleServices.js
 * Custom React hooks encapsulating all Google service interactions:
 *  - Google Analytics 4 (gtag) — page views & custom events
 *  - Feedback API          — logged to Cloud Logging via server
 */

import { useCallback } from 'react';

// ── Google Analytics 4 ────────────────────────────────────────────────────────

/**
 * useAnalytics
 * Provides trackPageView and trackEvent helpers that safely call
 * window.gtag. No-ops gracefully when GA4 is not loaded (e.g. dev mode
 * without a Measurement ID configured).
 */
export function useAnalytics() {
  /** @param {string} pageName  Human-readable label shown in GA4 reports */
  /** @param {string} pageId    Route identifier used in page_location */
  const trackPageView = useCallback((pageName, pageId) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_title:    pageName,
      page_location: `${window.location.origin}/#${pageId}`,
    });
  }, []);

  /**
   * Track an arbitrary GA4 event.
   * @param {string} eventName   GA4 snake_case event name
   * @param {Object} [params={}] Additional GA4 event parameters
   */
  const trackEvent = useCallback((eventName, params = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
  }, []);

  return { trackPageView, trackEvent };
}

// ── Feedback API ──────────────────────────────────────────────────────────────

/**
 * useFeedback
 * Submits star-rating feedback to /api/feedback, which is logged to
 * Google Cloud Logging on the server side.
 */
export function useFeedback() {
  /**
   * @param {{ rating: number, comment?: string, page?: string }} payload
   * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
   */
  const submitFeedback = useCallback(async ({ rating, comment = '', page = '' }) => {
    try {
      const response = await fetch('/api/feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ rating, comment, page }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Submission failed.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  return { submitFeedback };
}
