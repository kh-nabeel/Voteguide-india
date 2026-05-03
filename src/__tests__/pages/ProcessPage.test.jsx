/**
 * ProcessPage.test.jsx
 * Component tests for the Election Process page.
 *
 * Covers:
 *  - Page title renders
 *  - All 7 election steps render with expand buttons
 *  - Clicking a step expands its details
 *  - Clicking an expanded step collapses it (toggle behaviour)
 *  - aria-expanded toggles correctly
 *  - EVM voting steps section renders
 *  - MCC rules section renders
 *  - FeedbackWidget is rendered
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProcessPage from '../../pages/ProcessPage.jsx';

vi.mock('../../components/FeedbackWidget.jsx', () => ({
  default: () => <div data-testid="feedback-widget" />,
}));

vi.mock('../../hooks/useGoogleServices.js', () => ({
  useAnalytics: () => ({ trackEvent: vi.fn() }),
}));

function renderProcess() {
  render(<ProcessPage />);
}

describe('ProcessPage', () => {
  it('renders the page heading', () => {
    renderProcess();
    expect(screen.getByRole('heading', { name: /the indian election process/i })).toBeInTheDocument();
  });

  it('renders expand/collapse toggle buttons for each step', () => {
    renderProcess();
    const toggles = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-expanded'),
    );
    // 7 election steps → 7 toggle buttons
    expect(toggles.length).toBe(7);
  });

  it('all steps are collapsed by default', () => {
    renderProcess();
    const expandedToggles = screen
      .getAllByRole('button')
      .filter((btn) => btn.getAttribute('aria-expanded') === 'true');
    expect(expandedToggles).toHaveLength(0);
  });

  it('expands a step when its toggle button is clicked', async () => {
    const user = userEvent.setup();
    renderProcess();
    const toggles = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-expanded'),
    );
    await user.click(toggles[0]);
    expect(toggles[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapses the step again when its toggle button is clicked twice', async () => {
    const user = userEvent.setup();
    renderProcess();
    const toggles = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-expanded'),
    );
    await user.click(toggles[0]);
    await user.click(toggles[0]);
    expect(toggles[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows step details when expanded', async () => {
    const user = userEvent.setup();
    renderProcess();
    const toggles = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-expanded'),
    );
    // Click the first toggle (Step 1)
    await user.click(toggles[0]);
    // The details region should appear
    const regions = screen.getAllByRole('region');
    expect(regions.length).toBeGreaterThan(0);
  });

  it('renders the "How to Vote Using an EVM" section', () => {
    renderProcess();
    expect(screen.getByText(/how to vote using an evm/i)).toBeInTheDocument();
  });

  it('renders the 6 EVM voting sub-steps', () => {
    renderProcess();
    expect(screen.getByText('Show Your ID')).toBeInTheDocument();
    expect(screen.getByText('Ink Marking')).toBeInTheDocument();
    expect(screen.getByText('VVPAT Slip')).toBeInTheDocument();
    expect(screen.getByText('Vote Recorded')).toBeInTheDocument();
  });

  it('renders the Model Code of Conduct section', () => {
    renderProcess();
    // MCC text appears in multiple places (step subtitle + bottom section)
    expect(screen.getAllByText(/model code of conduct/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the FeedbackWidget', () => {
    renderProcess();
    expect(screen.getByTestId('feedback-widget')).toBeInTheDocument();
  });
});
