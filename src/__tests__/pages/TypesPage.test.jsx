/**
 * TypesPage.test.jsx
 * Component tests for the Types of Elections page.
 *
 * Covers:
 *  - Page heading renders
 *  - Three election type cards render (Lok Sabha, Rajya Sabha, Vidhan Sabha)
 *  - Comparison table renders with headers
 *  - Table caption is present (accessibility)
 *  - Local elections note renders
 *  - FeedbackWidget renders
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TypesPage from '../../pages/TypesPage.jsx';

vi.mock('../../components/FeedbackWidget.jsx', () => ({
  default: () => <div data-testid="feedback-widget" />,
}));

function renderTypes() {
  render(<TypesPage />);
}

describe('TypesPage', () => {
  it('renders the page heading', () => {
    renderTypes();
    expect(screen.getByRole('heading', { name: /types of elections in india/i })).toBeInTheDocument();
  });

  it('renders the Lok Sabha election type card', () => {
    renderTypes();
    // Lok Sabha appears in both the card h2 and the comparison table header
    expect(screen.getAllByText('Lok Sabha').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Rajya Sabha election type card', () => {
    renderTypes();
    expect(screen.getAllByText('Rajya Sabha').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Vidhan Sabha election type card', () => {
    renderTypes();
    expect(screen.getAllByText('Vidhan Sabha').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the comparison table with column headers', () => {
    renderTypes();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Feature' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Lok Sabha' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Rajya Sabha' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Vidhan Sabha' })).toBeInTheDocument();
  });

  it('comparison table has an accessible caption', () => {
    renderTypes();
    expect(
      screen.getByText(/comparison of lok sabha, rajya sabha, and vidhan sabha/i),
    ).toBeInTheDocument();
  });

  it('renders the Quick Comparison section heading', () => {
    renderTypes();
    expect(screen.getByText('Quick Comparison')).toBeInTheDocument();
  });

  it('renders the Local Elections note', () => {
    renderTypes();
    expect(screen.getByText(/also important: local body elections/i)).toBeInTheDocument();
  });

  it('renders the FeedbackWidget', () => {
    renderTypes();
    expect(screen.getByTestId('feedback-widget')).toBeInTheDocument();
  });

  it('renders meta pills with Lok Sabha seat count', () => {
    renderTypes();
    // Should show "543" seats for Lok Sabha somewhere in the pill text
    expect(screen.getByText(/seats: 543/i)).toBeInTheDocument();
  });
});
