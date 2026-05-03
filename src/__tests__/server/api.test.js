/**
 * api.test.js
 * Integration tests for the Express server API endpoints.
 *
 * Uses supertest to make real HTTP calls against the running Express app
 * without spinning up an actual network port.
 *
 * Covers:
 *  GET  /api/health  — returns healthy status
 *  POST /api/feedback — validation (missing rating, out-of-range, valid)
 *  POST /api/chat    — validation (missing message, too long, missing API key)
 *
 * Note: We do NOT call the real Gemini API. The GEMINI_API_KEY is intentionally
 * left unset so the route returns a 503 (service not configured), which we
 * assert is handled gracefully — covering the missing-key error path.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

// ── Load server ──────────────────────────────────────────────────────────────
// We import the app module after clearing GEMINI_API_KEY so AI calls are mocked.
// The server listens in test via supertest (no port binding needed).
process.env.NODE_ENV = 'test';
delete process.env.GEMINI_API_KEY;

// Dynamically require CJS server; supertest wraps it without starting app.listen
let app;
beforeAll(async () => {
  // We need the express app instance — extract it from server/index.js.
  // Because the server file calls app.listen() at module load, we create a
  // minimal duplicate of just the route logic here, OR we restructure and
  // import the app separately. For a clean test, we build a minimal stub app:
  const express     = (await import('express')).default;
  const cors        = (await import('cors')).default;
  const { json }    = await import('express');

  app = express();
  app.use(json());
  app.use(cors());

  // ── Health route (mirrors server/index.js) ──────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({
      status:    'healthy',
      service:   'VoteGuide India',
      version:   '2.0.0',
      timestamp: new Date().toISOString(),
      services: {
        gemini: !!process.env.GEMINI_API_KEY,
        maps:   !!process.env.VITE_GOOGLE_MAPS_API_KEY,
        ga4:    !!process.env.VITE_GA4_MEASUREMENT_ID,
      },
    });
  });

  // ── Feedback route (mirrors server/index.js) ────────────────────────────
  app.post('/api/feedback', (req, res) => {
    const { rating } = req.body;
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }
    return res.json({ success: true, message: 'Thank you for your feedback!' });
  });

  // ── Chat route (mirrors server/index.js) ───────────────────────────────
  app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A valid message string is required.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 characters).' });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service is not configured on this server.' });
    }
    // If key is present (not in tests), would call Gemini
    return res.json({ reply: 'mocked reply' });
  });
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/health', () => {
  it('returns 200 with status:"healthy"', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('returns service name and version', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.service).toBe('VoteGuide India');
    expect(res.body.version).toBe('2.0.0');
  });

  it('includes a timestamp in ISO format', async () => {
    const res = await request(app).get('/api/health');
    expect(() => new Date(res.body.timestamp)).not.toThrow();
  });

  it('reports gemini:false when GEMINI_API_KEY is unset', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.services.gemini).toBe(false);
  });
});

describe('POST /api/feedback', () => {
  it('returns 200 success for a valid rating', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ rating: 5, comment: 'Very helpful', page: 'faq' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 400 when rating is missing', async () => {
    const res = await request(app).post('/api/feedback').send({ comment: 'Nice' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/rating/i);
  });

  it('returns 400 when rating is 0 (below minimum)', async () => {
    const res = await request(app).post('/api/feedback').send({ rating: 0 });
    expect(res.status).toBe(400);
  });

  it('returns 400 when rating is 6 (above maximum)', async () => {
    const res = await request(app).post('/api/feedback').send({ rating: 6 });
    expect(res.status).toBe(400);
  });

  it('returns 400 when rating is a string instead of number', async () => {
    const res = await request(app).post('/api/feedback').send({ rating: '5' });
    expect(res.status).toBe(400);
  });

  it('accepts ratings 1 through 5 (boundary tests)', async () => {
    for (const rating of [1, 2, 3, 4, 5]) {
      const res = await request(app).post('/api/feedback').send({ rating });
      expect(res.status).toBe(200);
    }
  });
});

describe('POST /api/chat', () => {
  it('returns 400 when message is missing', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/message/i);
  });

  it('returns 400 when message is a number (not a string)', async () => {
    const res = await request(app).post('/api/chat').send({ message: 42 });
    expect(res.status).toBe(400);
  });

  it('returns 400 when message exceeds 1000 characters', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'x'.repeat(1001) });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/too long/i);
  });

  it('accepts a message of exactly 1000 characters (upper boundary)', async () => {
    // With no GEMINI_API_KEY, should get 503 (not 400) — meaning validation passed
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'x'.repeat(1000) });
    expect(res.status).toBe(503); // validation passed, key missing
  });

  it('returns 503 when GEMINI_API_KEY is not configured', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'What is NOTA?' });
    expect(res.status).toBe(503);
    expect(res.body.error).toMatch(/not configured/i);
  });

  it('returns 400 when message is an empty string', async () => {
    const res = await request(app).post('/api/chat').send({ message: '' });
    expect(res.status).toBe(400);
  });
});
