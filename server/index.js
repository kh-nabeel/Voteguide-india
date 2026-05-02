/**
 * server/index.js — VoteGuide India Express Server
 *
 * Google Cloud Services:
 *  - Google Gemini AI     : /api/chat — AI election assistant
 *  - Google Cloud Logging : structured JSON logs to stdout
 *  - Google Cloud Run     : container entrypoint (PORT env var)
 */

'use strict';

const path        = require('path');
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const compression = require('compression');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');
require('dotenv').config();

const app           = express();
const PORT          = process.env.PORT || 8080;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ── Structured Logger (Cloud Logging compatible) ──────────────────────────────
function log(severity, message, data = {}) {
  const entry = { severity, message, ...data, timestamp: new Date().toISOString() };
  severity === 'ERROR' ? console.error(JSON.stringify(entry)) : console.log(JSON.stringify(entry));
}

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:    ["'self'"],
      scriptSrc:     ["'self'", "'unsafe-inline'", 'https://maps.googleapis.com', 'https://www.googletagmanager.com', 'https://www.google-analytics.com'],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc:      ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:       ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:        ["'self'", 'data:', 'https://maps.googleapis.com', 'https://maps.gstatic.com', 'https://*.ggpht.com', 'https://www.google-analytics.com'],
      connectSrc:    ["'self'", 'https://maps.googleapis.com', 'https://www.google-analytics.com', 'https://region1.google-analytics.com', 'https://generativelanguage.googleapis.com'],
      frameSrc:      ["'none'"],
      objectSrc:     ["'none'"],
    },
  },
}));

app.use(compression());
app.use(cors({ origin: IS_PRODUCTION ? (process.env.ALLOWED_ORIGIN || true) : true }));
app.use(express.json({ limit: '16kb' }));

// HTTP logging
if (IS_PRODUCTION) {
  app.use(morgan((tokens, req, res) => JSON.stringify({
    severity:    parseInt(tokens.status(req, res), 10) >= 500 ? 'ERROR' : 'INFO',
    httpRequest: {
      requestMethod: tokens.method(req, res),
      requestUrl:    tokens.url(req, res),
      status:        parseInt(tokens.status(req, res), 10),
      latency:       `${tokens['response-time'](req, res)}ms`,
    },
    timestamp: new Date().toISOString(),
  })));
} else {
  app.use(morgan('dev'));
}

// ── Rate Limiters ─────────────────────────────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, max: 20,
  standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' },
});

const feedbackLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, max: 10,
  message: { error: 'Too many submissions. Please wait.' },
});

// ── Static Files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../dist'), {
  maxAge: IS_PRODUCTION ? '1d' : 0,
  etag: true,
}));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy', service: 'VoteGuide India', version: '2.0.0',
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      maps:   !!process.env.VITE_GOOGLE_MAPS_API_KEY,
      ga4:    !!process.env.VITE_GA4_MEASUREMENT_ID,
    },
  });
});

// ── Gemini Chat Endpoint ──────────────────────────────────────────────────────
app.post('/api/chat', chatLimiter, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'A valid message string is required.' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 characters).' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    log('ERROR', 'GEMINI_API_KEY not configured');
    return res.status(503).json({ error: 'AI service is not configured on this server.' });
  }

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { maxOutputTokens: 400, temperature: 0.4, topP: 0.9 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });

    const formattedHistory = history
      .filter((h) => h.role && h.content)
      .map((h) => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(h.content) }] }));

    const chat  = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const reply  = result.response.text();

    log('INFO', 'Chat handled', { messageLength: message.length, replyLength: reply.length });
    return res.json({ reply });
  } catch (err) {
    log('ERROR', 'Gemini error', { message: err.message });
    return res.status(502).json({ error: 'The AI assistant is temporarily unavailable.' });
  }
});

// ── Feedback Endpoint (logs to Cloud Logging via stdout) ──────────────────────
app.post('/api/feedback', feedbackLimiter, (req, res) => {
  const { rating, comment = '', page = '' } = req.body;

  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
  }

  log('INFO', 'Feedback received', {
    rating,
    comment:   String(comment).slice(0, 500),
    page:      String(page).slice(0, 50),
  });

  return res.json({ success: true, message: 'Thank you for your feedback!' });
});

// ── SPA Catch-all ─────────────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  log('INFO', 'VoteGuide India started', {
    port: PORT, environment: IS_PRODUCTION ? 'production' : 'development',
  });
});

// ── Gemini System Prompt ──────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are "Election Guide", a knowledgeable assistant for VoteGuide India — an educational portal about Indian elections. Help every citizen understand India's democratic process.

ROLE: Explain Indian elections clearly and simply. Cover Lok Sabha, Rajya Sabha, Vidhan Sabha, and local elections. Always be politically neutral.

RULES:
- Plain English, no jargon unless explained
- Maximum 150 words per response
- Never favour any party or candidate
- End with one follow-up suggestion

KEY FACTS:
- Voter registration: voters.eci.gov.in, Form 6, 18+ Indian citizen required
- 12 approved photo IDs accepted for voting
- EVM: made by BEL/ECIL, standalone, never connected to internet
- VVPAT: paper slip visible 7 seconds after vote
- NOTA introduced 2013 by Supreme Court order
- Lok Sabha: 543 seats, 272 needed for majority, 5-year term
- Rajya Sabha: 245 seats, elected by MLAs, permanent house
- MCC: in force from election announcement to result declaration
- Voter Helpline: 1950 (toll-free, all India)
- ECI established January 25, 1950 under Article 324`;
