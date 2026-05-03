/**
 * FAQPage.test.jsx
 * Component tests for the FAQ accordion page.
 *
 * Covers:
 *  - Page title renders
 *  - FAQ buttons render
 *  - Accordion expand / collapse toggles
 *  - aria-expanded attribute toggling
 *  - Voter eligibility section renders
 *  - "Am I Eligible" section present
 *  - Registration steps section renders
 *  - FeedbackWidget is rendered
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FAQPage from '../../pages/FAQPage.jsx';

// Mock FeedbackWidget so it doesn't need the full hook chain
vi.mock('../../components/FeedbackWidget.jsx', () => ({
  default: () => <div data-testid="feedback-widget" />,
}));

vi.mock('../../hooks/useGoogleServices.js', () => ({
  useAnalytics: () => ({ trackEvent: vi.fn() }),
}));

function renderFAQ() {
  render(<FAQPage />);
}

describe('FAQPage', () => {
  it('renders the page title', () => {
    renderFAQ();
    expect(screen.getByRole('heading', { name: /frequently asked questions/i })).toBeInTheDocument();
  });

  it('renders FAQ accordion buttons', () => {
    renderFAQ();
    // All FAQ buttons should have aria-expanded attribute
    const faqButtons = screen.getAllByRole('button');
    expect(faqButtons.length).toBeGreaterThan(0);
    const expandable = faqButtons.filter((btn) => btn.hasAttribute('aria-expanded'));
    expect(expandable.length).toBeGreaterThan(0);
  });

  it('FAQ answers are collapsed by default', () => {
    renderFAQ();
    const expandedButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.getAttribute('aria-expanded') === 'true');
    expect(expandedButtons).toHaveLength(0);
  });

  it('expands an FAQ item when its button is clicked', async () => {
    const user = userEvent.setup();
    renderFAQ();
    const faqButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.hasAttribute('aria-expanded'));
    await user.click(faqButtons[0]);
    expect(faqButtons[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapses the FAQ item when clicked again (toggle)', async () => {
    const user = userEvent.setup();
    renderFAQ();
    const faqButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.hasAttribute('aria-expanded'));
    await user.click(faqButtons[0]);
    await user.click(faqButtons[0]);
    expect(faqButtons[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders the voter eligibility section', () => {
    renderFAQ();
    expect(screen.getByText(/am i eligible to vote/i)).toBeInTheDocument();
  });

  it('renders "You ARE eligible if" with the Indian citizen criterion', () => {
    renderFAQ();
    expect(screen.getByText(/you are eligible if/i)).toBeInTheDocument();
    expect(screen.getByText('Indian citizen')).toBeInTheDocument();
  });

  it('renders "You are NOT eligible if" section', () => {
    renderFAQ();
    expect(screen.getByText(/you are not eligible if/i)).toBeInTheDocument();
  });

  it('renders the voter registration section', () => {
    renderFAQ();
    expect(screen.getByText(/how to register as a voter/i)).toBeInTheDocument();
  });

  it('renders the FeedbackWidget', () => {
    renderFAQ();
    expect(screen.getByTestId('feedback-widget')).toBeInTheDocument();
  });

  it('renders contact info with helpline 1950', () => {
    renderFAQ();
    expect(screen.getByText(/1950/)).toBeInTheDocument();
  });
});
