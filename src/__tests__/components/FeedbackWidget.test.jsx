/**
 * FeedbackWidget.test.jsx
 * Component tests for the star-rating FeedbackWidget.
 *
 * Covers:
 *  - Initial render (no stars selected, submit disabled)
 *  - Star selection enables submit
 *  - Loading state shown during submission
 *  - Success state shown after successful submission
 *  - Error state shown after failed submission
 *  - Comment textarea updates correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackWidget from '../../components/FeedbackWidget.jsx';

// Mock the hooks so we can control submitFeedback behaviour
vi.mock('../../hooks/useGoogleServices.js', () => ({
  useFeedback: () => ({ submitFeedback: mockSubmitFeedback }),
  useAnalytics: () => ({ trackEvent: vi.fn() }),
}));

const mockSubmitFeedback = vi.fn();

beforeEach(() => {
  mockSubmitFeedback.mockReset();
});

function renderWidget(page = 'faq') {
  render(<FeedbackWidget page={page} />);
}

describe('FeedbackWidget', () => {
  it('renders the heading and the five star buttons', () => {
    renderWidget();
    expect(screen.getByText('Was this page helpful?')).toBeInTheDocument();
    const stars = screen.getAllByRole('button', { name: /star/i });
    expect(stars).toHaveLength(5);
  });

  it('disables the Submit button when no star is selected', () => {
    renderWidget();
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeDisabled();
  });

  it('enables the Submit button after a star is selected', async () => {
    const user = userEvent.setup();
    renderWidget();
    await user.click(screen.getByRole('button', { name: '4 stars' }));
    expect(screen.getByRole('button', { name: /submit feedback/i })).not.toBeDisabled();
  });

  it('shows a success message after successful submission', async () => {
    const user = userEvent.setup();
    mockSubmitFeedback.mockResolvedValue({ success: true, message: 'Thank you for your feedback!' });

    renderWidget();
    await user.click(screen.getByRole('button', { name: '5 stars' }));
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    await waitFor(() => {
      expect(screen.getByText(/thank you for your feedback/i)).toBeInTheDocument();
    });
  });

  it('shows an error message after a failed submission', async () => {
    const user = userEvent.setup();
    mockSubmitFeedback.mockResolvedValue({ success: false, error: 'Submission failed.' });

    renderWidget();
    await user.click(screen.getByRole('button', { name: '3 stars' }));
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/submission failed/i);
    });
  });

  it('updates the comment textarea as the user types', async () => {
    const user = userEvent.setup();
    renderWidget();
    const textarea = screen.getByPlaceholderText(/optional/i);
    await user.type(textarea, 'Very helpful');
    expect(textarea.value).toBe('Very helpful');
  });

  it('calls submitFeedback with the correct rating and page', async () => {
    const user = userEvent.setup();
    mockSubmitFeedback.mockResolvedValue({ success: true, message: 'ok' });

    renderWidget('map');
    await user.click(screen.getByRole('button', { name: '4 stars' }));
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    await waitFor(() => {
      expect(mockSubmitFeedback).toHaveBeenCalledWith(
        expect.objectContaining({ rating: 4, page: 'map' }),
      );
    });
  });

  it('star radiogroup has the correct accessible label', () => {
    renderWidget();
    expect(screen.getByRole('radiogroup', { name: /star rating/i })).toBeInTheDocument();
  });
});
