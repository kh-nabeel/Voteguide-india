import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '../../components/Footer.jsx';

describe('Footer', () => {
  it('renders brand and disclaimer text', () => {
    render(<Footer navigate={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /VoteGuide India/i })).toBeInTheDocument();
    expect(screen.getByText(/Powered by Google Gemini AI/i)).toBeInTheDocument();
  });

  it('renders official resource links', () => {
    render(<Footer navigate={vi.fn()} />);
    expect(screen.getByRole('link', { name: /Election Commission of India/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voter Registration Portal/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /National Voter Service Portal/i })).toBeInTheDocument();
  });

  it('calls navigate when navigation buttons are clicked', async () => {
    const navigateMock = vi.fn();
    const user = userEvent.setup();
    render(<Footer navigate={navigateMock} />);

    await user.click(screen.getByRole('button', { name: /Election Process/i }));
    expect(navigateMock).toHaveBeenCalledWith('process');

    await user.click(screen.getByRole('button', { name: /Types of Elections/i }));
    expect(navigateMock).toHaveBeenCalledWith('types');

    await user.click(screen.getByRole('button', { name: /ECI Office Locator/i }));
    expect(navigateMock).toHaveBeenCalledWith('map');

    await user.click(screen.getByRole('button', { name: /FAQs/i }));
    expect(navigateMock).toHaveBeenCalledWith('faq');

    await user.click(screen.getByRole('button', { name: /Ask the Guide/i }));
    expect(navigateMock).toHaveBeenCalledWith('chat');
  });
});
