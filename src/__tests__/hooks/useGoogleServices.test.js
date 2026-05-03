/**
 * useGoogleServices.test.js
 * Tests for useAnalytics and useFeedback hooks.
 *
 * Covers:
 *  - useAnalytics: no-ops when gtag is missing, calls gtag correctly when present
 *  - useFeedback: happy path submission, network error, server error response
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnalytics, useFeedback } from '../../hooks/useGoogleServices.js';

// ── useAnalytics ─────────────────────────────────────────────────────────────

describe('useAnalytics', () => {
  describe('trackPageView()', () => {
    it('calls window.gtag with page_view event when gtag is a function', () => {
      window.gtag = vi.fn();
      const { result } = renderHook(() => useAnalytics());
      act(() => result.current.trackPageView('Home', 'home'));
      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_title:    'Home',
        page_location: expect.stringContaining('#home'),
      });
    });

    it('does not throw when window.gtag is undefined', () => {
      window.gtag = undefined;
      const { result } = renderHook(() => useAnalytics());
      expect(() => act(() => result.current.trackPageView('Home', 'home'))).not.toThrow();
    });

    it('does not throw when window.gtag is not a function (string)', () => {
      window.gtag = 'not-a-function';
      const { result } = renderHook(() => useAnalytics());
      expect(() => act(() => result.current.trackPageView('Test', 'test'))).not.toThrow();
    });
  });

  describe('trackEvent()', () => {
    it('calls window.gtag with the given event name and params', () => {
      window.gtag = vi.fn();
      const { result } = renderHook(() => useAnalytics());
      act(() => result.current.trackEvent('feature_card_click', { feature: 'map' }));
      expect(window.gtag).toHaveBeenCalledWith('event', 'feature_card_click', { feature: 'map' });
    });

    it('calls gtag with empty params object when params are omitted', () => {
      window.gtag = vi.fn();
      const { result } = renderHook(() => useAnalytics());
      act(() => result.current.trackEvent('faq_opened'));
      expect(window.gtag).toHaveBeenCalledWith('event', 'faq_opened', {});
    });

    it('silently no-ops when gtag is undefined', () => {
      window.gtag = undefined;
      const { result } = renderHook(() => useAnalytics());
      expect(() => act(() => result.current.trackEvent('test_event'))).not.toThrow();
    });
  });
});

// ── useFeedback ──────────────────────────────────────────────────────────────

describe('useFeedback', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns success:true when the API responds with ok:true', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok:   true,
      json: () => Promise.resolve({ message: 'Thank you!' }),
    }));

    const { result } = renderHook(() => useFeedback());
    let response;
    await act(async () => {
      response = await result.current.submitFeedback({ rating: 5, comment: 'Great', page: 'faq' });
    });

    expect(response.success).toBe(true);
    expect(response.message).toBe('Thank you!');
  });

  it('returns success:false when the API responds with ok:false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok:   false,
      json: () => Promise.resolve({ error: 'Submission failed.' }),
    }));

    const { result } = renderHook(() => useFeedback());
    let response;
    await act(async () => {
      response = await result.current.submitFeedback({ rating: 2 });
    });

    expect(response.success).toBe(false);
    expect(response.error).toBe('Submission failed.');
  });

  it('returns success:false with a network error message when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network down')));

    const { result } = renderHook(() => useFeedback());
    let response;
    await act(async () => {
      response = await result.current.submitFeedback({ rating: 3 });
    });

    expect(response.success).toBe(false);
    expect(response.error).toMatch(/network error/i);
  });

  it('POSTs to /api/feedback with correct payload', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok:   true,
      json: () => Promise.resolve({ message: 'ok' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { result } = renderHook(() => useFeedback());
    await act(async () => {
      await result.current.submitFeedback({ rating: 4, comment: 'helpful', page: 'map' });
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/feedback', expect.objectContaining({
      method: 'POST',
      body:   JSON.stringify({ rating: 4, comment: 'helpful', page: 'map' }),
    }));
  });
});
