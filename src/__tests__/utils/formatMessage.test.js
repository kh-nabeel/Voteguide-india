/**
 * formatMessage.test.js
 * Unit tests for the formatMessage utility.
 * Covers: happy path, edge cases, and boundary conditions.
 */

import { describe, it, expect } from 'vitest';
import { formatMessage } from '../../utils/formatMessage.js';

describe('formatMessage()', () => {
  // ── Happy path ──────────────────────────────────────────────────────────────

  it('converts **bold** markers to <strong> tags', () => {
    expect(formatMessage('Hello **world**')).toBe('Hello <strong>world</strong>');
  });

  it('converts multiple **bold** markers in one string', () => {
    const input  = '**Voter ID** is required. **NOTA** was introduced in 2013.';
    const output = formatMessage(input);
    expect(output).toContain('<strong>Voter ID</strong>');
    expect(output).toContain('<strong>NOTA</strong>');
  });

  it('converts newlines to <br /> tags', () => {
    expect(formatMessage('Line 1\nLine 2')).toBe('Line 1<br />Line 2');
  });

  it('handles mixed bold and newlines', () => {
    const result = formatMessage('**Step 1**\nRegister online.');
    expect(result).toBe('<strong>Step 1</strong><br />Register online.');
  });

  // ── Edge cases ──────────────────────────────────────────────────────────────

  it('returns an empty string when input is an empty string', () => {
    expect(formatMessage('')).toBe('');
  });

  it('returns empty string when given a non-string value (number)', () => {
    expect(formatMessage(42)).toBe('');
  });

  it('returns empty string when given undefined', () => {
    expect(formatMessage(undefined)).toBe('');
  });

  it('returns empty string when given null', () => {
    expect(formatMessage(null)).toBe('');
  });

  it('leaves plain text unchanged (no markdown tokens)', () => {
    const text = 'The voter helpline is 1950.';
    expect(formatMessage(text)).toBe(text);
  });

  it('handles an unclosed ** marker gracefully (no match, no crash)', () => {
    // An unclosed ** should not produce any <strong> tag
    const result = formatMessage('This is **unclosed');
    expect(result).not.toContain('<strong>');
    expect(result).toBe('This is **unclosed');
  });

  it('handles consecutive newlines (multiple <br /> replacements)', () => {
    expect(formatMessage('a\n\nb')).toBe('a<br /><br />b');
  });

  it('preserves existing HTML-unsafe characters unmodified (no double-encoding)', () => {
    // We do not escape arbitrary HTML — caller is responsible for only passing
    // safe AI-generated text. Verify we don't break angle-bracket literals.
    const result = formatMessage('x > y');
    expect(result).toBe('x > y');
  });
});
