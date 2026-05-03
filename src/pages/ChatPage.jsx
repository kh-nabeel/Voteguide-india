/**
 * ChatPage.jsx
 * 
 * WHY THIS EXISTS:
 * This component provides an accessible, conversational interface to the Gemini AI. 
 * We implemented it with strict state management (tracking conversation history) and 
 * an `aria-live="polite"` log to ensure screen-reader compatibility. The frontend 
 * never calls Gemini directly; instead, it delegates to our Express backend to 
 * maintain security, rate limiting, and API key protection.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { QUICK_TOPICS }  from '../data/electionData.js';
import { useAnalytics }  from '../hooks/useGoogleServices.js';
import { formatMessage } from '../utils/formatMessage.js';

/** Initial bot greeting shown on first load */
const WELCOME_MESSAGE = {
  role:    'assistant',
  content: `Hello! I am the VoteGuide AI Assistant, powered by Google Gemini.

I can help you understand:
• How to register as a voter and what documents you need
• What happens step-by-step on election day
• How EVMs and VVPATs work and why they are secure
• The difference between Lok Sabha, Rajya Sabha, and Vidhan Sabha
• The Model Code of Conduct, NOTA, and the FPTP system
• Who can contest elections and what the nomination process involves

Ask me any question about Indian elections in plain English.`,
};


export default function ChatPage() {
  const [messages,    setMessages]    = useState([WELCOME_MESSAGE]);
  const [inputValue,  setInputValue]  = useState('');
  const [isLoading,   setIsLoading]   = useState(false);

  const bottomRef  = useRef(null);  // for auto-scroll
  const inputRef   = useRef(null);  // for re-focus after send

  const { trackEvent } = useAnalytics();

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** Send a message to the /api/chat endpoint */
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text ?? inputValue).trim();
    if (!trimmed || isLoading) {return;}

    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setIsLoading(true);

    trackEvent('chat_message_sent', { topic: trimmed.slice(0, 60) });

    try {
      // Build conversation history (exclude welcome message)
      const history = messages
        .slice(1)
        .map((m) => ({
          role:    m.role === 'assistant' ? 'model' : 'user',
          content: m.content,
        }));

      const response = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: trimmed, history }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role:    'assistant',
          content: response.ok
            ? data.reply
            : (data.error ?? 'Something went wrong. Please try again.'),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role:    'assistant',
          content: 'Unable to reach the assistant. Please check your connection and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [inputValue, isLoading, messages, trackEvent]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">

      {/* ── Chat Header ── */}
      <div className="chat-header" aria-label="AI assistant info">
        <div className="chat-header__avatar" aria-hidden="true">🤖</div>
        <div className="chat-header__info">
          <h2>VoteGuide AI Assistant</h2>
          <p>Powered by Google Gemini · Indian Election Education</p>
        </div>
        <div className="online-badge" role="status" aria-live="polite">
          🟢 Online
        </div>
      </div>

      {/* ── Quick Topic Chips ── */}
      <div className="quick-topics" aria-label="Suggested questions">
        <div className="quick-topics__label">Click a question to ask instantly:</div>
        <div className="quick-topics__grid">
          {QUICK_TOPICS.map(({ label, icon }) => (
            <button
              key={label}
              className="topic-chip"
              onClick={() => sendMessage(label)}
              disabled={isLoading}
              aria-label={`Ask: ${label}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Window ── */}
      <div
        className="chat-window"
        role="log"
        aria-label="Chat conversation"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message${msg.role === 'user' ? ' message--user' : ''}`}
          >
            <div
              className={`msg-avatar ${msg.role === 'user' ? 'msg-avatar--user' : 'msg-avatar--bot'}`}
              aria-hidden="true"
            >
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div
              className={`msg-bubble ${msg.role === 'user' ? 'msg-bubble--user' : 'msg-bubble--bot'}`}
              // Only bot messages contain formatted HTML; user messages are plain text
              {...(msg.role === 'assistant'
                ? { dangerouslySetInnerHTML: { __html: formatMessage(msg.content) } }
                : { children: msg.content }
              )}
            />
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="message" role="status" aria-label="Assistant is typing">
            <div className="msg-avatar msg-avatar--bot" aria-hidden="true">🤖</div>
            <div className="msg-bubble msg-bubble--bot">
              <div className="typing" aria-hidden="true">
                <div className="typing__dot" />
                <div className="typing__dot" />
                <div className="typing__dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input Row ── */}
      <div
        className="chat-input-row"
        role="form"
        aria-label="Message input"
      >
        <label htmlFor="chat-input" className="sr-only">
          Type your election question here
        </label>
        <textarea
          id="chat-input"
          ref={inputRef}
          className="chat-input"
          placeholder="Type your question about Indian elections… (Enter to send)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
          aria-label="Type your election question"
          maxLength={1000}
        />
        <button
          className="chat-send"
          onClick={() => sendMessage()}
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
          aria-busy={isLoading}
        >
          {isLoading ? '…' : 'Send'}
        </button>
      </div>

      <p className="chat-disclaimer">
        ℹ️ This AI provides general election education only. For official information,
        visit{' '}
        <a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer">
          www.eci.gov.in
        </a>{' '}
        or call <strong>1950</strong>. The assistant is politically neutral.
      </p>

    </div>
  );
}
