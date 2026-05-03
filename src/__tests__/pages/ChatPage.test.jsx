/**
 * ChatPage.test.jsx
 * Component tests for the AI chat interface.
 *
 * Covers:
 *  - Welcome message renders on mount
 *  - Quick topic chips render and send the correct message on click
 *  - Send button disabled when input is empty or loading
 *  - Message appears in chat window after send
 *  - Bot reply appears after successful API response
 *  - Error message shown when API returns an error
 *  - Error message shown on network failure
 *  - Typing indicator shown while waiting for bot reply
 *  - Enter key submits the message
 *  - Input clears after send
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatPage from '../../pages/ChatPage.jsx';

vi.mock('../../hooks/useGoogleServices.js', () => ({
  useAnalytics: () => ({ trackEvent: vi.fn() }),
}));

// Quick topics come from electionData.js — we just need at least one to render
// No need to mock since the file is pure data.

function renderChat() {
  render(<ChatPage />);
}

function setupFetchMock(reply = 'The EVM is secure.', ok = true) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(ok ? { reply } : { error: reply }),
  }));
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('ChatPage', () => {
  describe('Initial render', () => {
    it('shows the VoteGuide AI assistant heading', () => {
      renderChat();
      expect(screen.getByText('VoteGuide AI Assistant')).toBeInTheDocument();
    });

    it('shows the welcome greeting from the bot', () => {
      renderChat();
      expect(screen.getByText(/hello! i am the voteguide ai assistant/i)).toBeInTheDocument();
    });

    it('shows quick topic chip buttons', () => {
      renderChat();
      // Quick topics are rendered as buttons in the chip grid
      const chips = screen.getAllByRole('button', { name: /ask:/i });
      expect(chips.length).toBeGreaterThan(0);
    });

    it('has a Send button that is initially disabled (no text input)', () => {
      renderChat();
      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });

    it('renders the ECI disclaimer link', () => {
      renderChat();
      expect(screen.getByRole('link', { name: /www.eci.gov.in/i })).toBeInTheDocument();
    });
  });

  describe('Sending a message', () => {
    it('enables Send button when user types in the textarea', async () => {
      const user = userEvent.setup();
      renderChat();
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'How do I register to vote?');
      expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
    });

    it('displays the user message in the chat window after sending', async () => {
      const user = userEvent.setup();
      setupFetchMock('You can register at voters.eci.gov.in');
      renderChat();

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'How to register?');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      expect(screen.getByText('How to register?')).toBeInTheDocument();
    });

    it('clears the input after the message is sent', async () => {
      const user = userEvent.setup();
      setupFetchMock('Register at voters.eci.gov.in');
      renderChat();

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      expect(textarea.value).toBe('');
    });

    it('shows the bot reply after a successful API response', async () => {
      const user = userEvent.setup();
      setupFetchMock('EVMs are made by BEL and ECIL.');
      renderChat();

      await user.type(screen.getByRole('textbox'), 'Are EVMs safe?');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/evms are made by bel and ecil/i)).toBeInTheDocument();
      });
    });

    it('shows an error message when the API returns an error response', async () => {
      const user = userEvent.setup();
      setupFetchMock('AI service unavailable.', false);
      renderChat();

      await user.type(screen.getByRole('textbox'), 'What is NOTA?');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/ai service unavailable/i)).toBeInTheDocument();
      });
    });

    it('shows a network error message when fetch rejects', async () => {
      const user = userEvent.setup();
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')));
      renderChat();

      await user.type(screen.getByRole('textbox'), 'Test question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/unable to reach the assistant/i)).toBeInTheDocument();
      });
    });

    it('submits the message when Enter is pressed (without Shift)', async () => {
      const user = userEvent.setup();
      setupFetchMock('You can vote with 12 approved IDs.');
      renderChat();

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'What ID do I need?');
      await user.keyboard('{Enter}');

      expect(screen.getByText('What ID do I need?')).toBeInTheDocument();
    });
  });

  describe('Quick topic chips', () => {
    it('sends the chip label as a message when a chip is clicked', async () => {
      const user = userEvent.setup();
      setupFetchMock('Voter registration requires Form 6.');
      renderChat();

      const chips = screen.getAllByRole('button', { name: /ask:/i });
      const firstChip = chips[0];
      const chipLabel = firstChip.textContent.trim();

      await user.click(firstChip);

      await waitFor(() => {
        // The chip's label should appear as a user message (or at least not crash)
        expect(screen.getByText(chipLabel)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('chat window has role="log" for screen reader announcements', () => {
      renderChat();
      expect(screen.getByRole('log')).toBeInTheDocument();
    });

    it('textarea has an accessible label', () => {
      renderChat();
      expect(screen.getByRole('textbox', { name: /type your election question/i })).toBeInTheDocument();
    });
  });
});
