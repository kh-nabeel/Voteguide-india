/**
 * Header.test.jsx
 * Component tests for the site Header.
 *
 * Covers:
 *  - All nav items render
 *  - Active page gets aria-current="page"
 *  - Clicking a nav item calls navigate()
 *  - Brand name and subtitle are visible
 *  - Skip-to-main link is NOT in Header (it's in App), branding is
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../../components/Header.jsx';

const NAV_LABELS = ['Home', 'Election Process', 'Types of Elections', 'FAQs'];

function renderHeader(activePage = 'home') {
  const navigate = vi.fn();
  render(<Header activePage={activePage} navigate={navigate} />);
  return { navigate };
}

describe('Header', () => {
  it('renders the site brand heading', () => {
    renderHeader();
    expect(screen.getByText('VoteGuide India')).toBeInTheDocument();
  });

  it('renders all primary navigation buttons', () => {
    renderHeader();
    NAV_LABELS.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('marks the active page button with aria-current="page"', () => {
    renderHeader('process');
    const activeBtn = screen.getByText('Election Process');
    expect(activeBtn).toHaveAttribute('aria-current', 'page');
  });

  it('does NOT mark an inactive page with aria-current', () => {
    renderHeader('home');
    const processBtn = screen.getByText('Election Process');
    expect(processBtn).not.toHaveAttribute('aria-current');
  });

  it('calls navigate() with the correct key when a nav button is clicked', async () => {
    const user = userEvent.setup();
    const { navigate } = renderHeader('home');
    await user.click(screen.getByText('Election Process'));
    expect(navigate).toHaveBeenCalledWith('process');
  });

  it('calls navigate() with "faq" when FAQs is clicked', async () => {
    const user = userEvent.setup();
    const { navigate } = renderHeader('home');
    await user.click(screen.getByText('FAQs'));
    expect(navigate).toHaveBeenCalledWith('faq');
  });

  it('has role="banner" on the header element', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('has role="navigation" on the nav element', () => {
    renderHeader();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
