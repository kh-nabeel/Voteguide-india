/**
 * HomePage.test.jsx
 * Component tests for the landing page.
 *
 * Covers:
 *  - Hero section renders with correct heading
 *  - All 5 feature cards render
 *  - "Explore Election Steps" button navigates to 'process'
 *  - "Ask the AI Guide" button navigates to 'chat'
 *  - Stats bar renders (Registered Voters, Lok Sabha Seats, etc.)
 *  - Feature card click fires navigate() with correct key
 *  - Alert banner is present with ECI link
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../../pages/HomePage.jsx';

// Stub GA4 hook so we don't need a real gtag
vi.mock('../../hooks/useGoogleServices.js', () => ({
  useAnalytics: () => ({ trackEvent: vi.fn() }),
}));

function renderHome(navigate = vi.fn()) {
  render(<HomePage navigate={navigate} />);
  return { navigate };
}

describe('HomePage', () => {
  it('renders the main hero heading', () => {
    renderHome();
    expect(screen.getByText("Understand India's Election Process")).toBeInTheDocument();
  });

  it('renders the alert banner with ECI link', () => {
    renderHome();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    const eciLink = screen.getByRole('link', { name: /eci website/i });
    expect(eciLink).toHaveAttribute('href', 'https://www.eci.gov.in');
  });

  it('renders all five feature cards', () => {
    renderHome();
    const cards = [
      'Election Process',
      'Types of Elections',
      'ECI Office Locator',
      'Ask the Guide',
      'Common Questions',
    ];
    cards.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('calls navigate("process") when "Explore Election Steps" is clicked', async () => {
    const user = userEvent.setup();
    const { navigate } = renderHome();
    await user.click(screen.getByRole('button', { name: /explore election steps/i }));
    expect(navigate).toHaveBeenCalledWith('process');
  });

  it('calls navigate("chat") when "Ask the AI Guide" is clicked', async () => {
    const user = userEvent.setup();
    const { navigate } = renderHome();
    await user.click(screen.getByRole('button', { name: /ask the ai guide/i }));
    expect(navigate).toHaveBeenCalledWith('chat');
  });

  it('calls navigate("map") when the ECI Office Locator feature card is clicked', async () => {
    const user = userEvent.setup();
    const { navigate } = renderHome();
    await user.click(screen.getByRole('button', { name: /open eci office locator/i }));
    expect(navigate).toHaveBeenCalledWith('map');
  });

  it('renders the stats bar with key statistics', () => {
    renderHome();
    expect(screen.getByText('97 Cr+')).toBeInTheDocument();
    expect(screen.getByText('543')).toBeInTheDocument();
    expect(screen.getByText('5 Yrs')).toBeInTheDocument();
  });

  it('renders the 7-step visual overview with Step labels', () => {
    renderHome();
    // Steps 1-7 should have accessible labels
    for (let step = 1; step <= 7; step++) {
      expect(screen.getByRole('button', { name: new RegExp(`step ${step}`, 'i') })).toBeInTheDocument();
    }
  });

  it('renders the "Learn Each Step in Detail" navigation button', () => {
    renderHome();
    expect(screen.getByRole('button', { name: /learn each step/i })).toBeInTheDocument();
  });
});
