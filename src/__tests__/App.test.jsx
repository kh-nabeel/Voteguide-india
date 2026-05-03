/**
 * App.test.jsx
 * Integration tests for the root App component.
 *
 * Covers:
 *  - Default page on mount is 'home' (HomePage renders)
 *  - Header navigation changes the visible page
 *  - Every page can be rendered without crashing
 *  - Skip-to-main-content link is present and points to #main-content
 *  - Footer renders
 *  - GA4 trackPageView is called on mount and on navigation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';

// ── Mocks ──────────────────────────────────────────────────────────────────────

// Mock heavy page components to keep integration tests fast
vi.mock('../pages/MapPage.jsx', () => ({
  default: () => <div>MapPage</div>,
}));

vi.mock('../components/FeedbackWidget.jsx', () => ({
  default: () => <div data-testid="feedback-widget" />,
}));

// Provide a real (but lightweight) analytics hook with a spy
const mockTrackPageView = vi.fn();
const mockTrackEvent    = vi.fn();

vi.mock('../hooks/useGoogleServices.js', () => ({
  useAnalytics: () => ({
    trackPageView: mockTrackPageView,
    trackEvent:    mockTrackEvent,
  }),
  useFeedback: () => ({ submitFeedback: vi.fn() }),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

describe('App (integration)', () => {
  describe('Default render', () => {
    it('renders the site header on mount', () => {
      render(<App />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders the HomePage by default', () => {
      render(<App />);
      expect(screen.getByText("Understand India's Election Process")).toBeInTheDocument();
    });

    it('renders a skip-to-main-content link', () => {
      render(<App />);
      const skipLink = screen.getByText(/skip to main content/i);
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('renders the footer', () => {
      render(<App />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('fires trackPageView for the Home page on initial mount', async () => {
      render(<App />);
      await waitFor(() => {
        expect(mockTrackPageView).toHaveBeenCalledWith('Home', 'home');
      });
    });
  });

  describe('Navigation', () => {
    /** Helper: click the first button matching name (always the header nav one) */
    async function clickNav(user, name) {
      const buttons = screen.getAllByRole('button', { name });
      await user.click(buttons[0]); // buttons[0] = header nav button
    }

    it('shows ElectionProcess page when "Election Process" nav button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      await clickNav(user, 'Election Process');
      expect(screen.getByRole('heading', { name: /the indian election process/i })).toBeInTheDocument();
    });

    it('shows TypesPage when "Types of Elections" nav button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      await clickNav(user, 'Types of Elections');
      expect(screen.getByRole('heading', { name: /types of elections in india/i })).toBeInTheDocument();
    });

    it('shows FAQPage when "FAQs" nav button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      await clickNav(user, 'FAQs');
      expect(screen.getByRole('heading', { name: /frequently asked questions/i })).toBeInTheDocument();
    });

    it('shows ChatPage when "Ask the Guide" nav button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      // footer also has this button, use getAllByRole
      const btns = screen.getAllByRole('button', { name: /ask the guide/i });
      await user.click(btns[0]);
      expect(screen.getByText('VoteGuide AI Assistant')).toBeInTheDocument();
    });

    it('shows MapPage when the Office Locator nav button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      await clickNav(user, /office locator/i);
      expect(screen.getByText('MapPage')).toBeInTheDocument();
    });

    it('fires trackPageView with correct args when navigating to Process page', async () => {
      const user = userEvent.setup();
      render(<App />);
      await clickNav(user, 'Election Process');
      await waitFor(() => {
        expect(mockTrackPageView).toHaveBeenCalledWith('Election Process', 'process');
      });
    });

    it('marks the active nav button with aria-current="page"', async () => {
      const user = userEvent.setup();
      render(<App />);
      await clickNav(user, 'FAQs');
      // The header nav button (index 0) should have aria-current
      const faqBtns = screen.getAllByRole('button', { name: 'FAQs' });
      const headerFaqBtn = faqBtns.find(
        (btn) => btn.getAttribute('aria-current') === 'page',
      );
      expect(headerFaqBtn).toBeTruthy();
    });
  });
});
