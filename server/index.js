/**
 * server/index.js — VoteGuide India Express Server
 * 
 * WHY THIS FILE EXISTS:
 * This server acts as a secure proxy between the client frontend and external APIs 
 * (like Google Gemini). By handling API calls server-side, we protect sensitive 
 * credentials (GEMINI_API_KEY) from being exposed in the browser. It also serves 
 * as the entry point for Google Cloud Run containerization, handling HTTP traffic,
 * enforcing OWASP security standards (via Helmet, CORS, and XSS sanitization), 
 * and funneling telemetry to Google Cloud Logging.
 */

'use strict';

const path        = require('path');
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const compression = require('compression');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');
const xss         = require('xss'); // OWASP compliant input sanitization
require('dotenv').config();

const app           = express();
const PORT          = process.env.PORT || 8080;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ── Gemini System Prompt ──────────────────────────────────────────────────────
// Defined at module top so the /api/chat route can reference it safely.
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
      frameSrc:      ["'self'", 'https://www.google.com/maps/embed/'],
      childSrc:      ["'self'", 'https://www.google.com/maps/embed/'],
      objectSrc:     ["'none'"],
    },
  },
}));

app.use(compression());
app.use(cors({ origin: IS_PRODUCTION ? (process.env.ALLOWED_ORIGIN || 'https://voteguide-india-946676557248.asia-south1.run.app') : true }));
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
  message: { error: 'Feedback limit reached. Please try again later.' },
});

// Global baseline rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 100, // 100 requests per 15 minutes
  standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' },
});

app.use('/api', globalLimiter);

// ── Utility: Sanitize Input ───────────────────────────────────────────────────
/**
 * WHY THIS EXISTS:
 * To protect against Cross-Site Scripting (XSS) attacks. By sanitizing all 
 * incoming strings with an OWASP-compliant library, we ensure malicious 
 * payloads cannot be executed or stored.
 * 
 * @param {string} input - The raw input string from the client
 * @returns {string} The sanitized string
 */
function sanitize(input) {
  if (typeof input !== 'string') return '';
  return xss(input); // Strips HTML tags and potentially dangerous attributes
}

// ── Static Files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../dist'), {
  maxAge: IS_PRODUCTION ? '1d' : 0,
  etag: true,
}));

// ── Health Check ──────────────────────────────────────────────────────────────
/**
 * WHY THIS EXISTS:
 * Required by container orchestration systems (like Google Cloud Run) to verify 
 * that the instance is healthy and ready to receive traffic. Also provides a quick 
 * diagnostic view of the environment variables.
 */
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
/**
 * WHY THIS EXISTS:
 * Proxies the user's prompt to Google Gemini. The server acts as a middleware to 
 * inject the SYSTEM_PROMPT (enforcing neutrality and political safety rules) and 
 * handles API Key authentication securely without exposing it to the client.
 */
app.post('/api/chat', chatLimiter, async (req, res) => {
  let { message, history = [] } = req.body;
  message = sanitize(message);

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

    const formattedHistory = history
      .filter((h) => h.role && h.content)
      .map((h) => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(h.content) }] }));

    const getModelParams = (modelName) => ({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { maxOutputTokens: 400, temperature: 0.4, topP: 0.9 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });

    let reply = '';
    try {
      const model = genAI.getGenerativeModel(getModelParams('gemini-2.0-flash'));
      const chat  = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(message);
      reply = result.response.text();
    } catch (err1) {
      log('INFO', 'gemini-2.0-flash failed, falling back to gemini-pro', { message: err1.message });
      const model = genAI.getGenerativeModel(getModelParams('gemini-pro'));
      const chat  = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(message);
      reply = result.response.text();
    }

    log('INFO', 'Chat handled', { messageLength: message.length, replyLength: reply.length });
    return res.json({ reply });
  } catch (err) {
    log('ERROR', 'Gemini error', { message: err.message });
    // Detailed error returned so user knows if it's a quota issue
    const isQuotaError = err.message.includes('429');
    return res.status(502).json({ 
      error: isQuotaError ? 'The AI assistant is temporarily unavailable due to high traffic (Quota Exceeded).' : 'The AI assistant is temporarily unavailable.' 
    });
  }
});

// ── Feedback Endpoint (logs to Cloud Logging via stdout) ──────────────────────
/**
 * WHY THIS EXISTS:
 * Provides a structured way to ingest user feedback. Instead of spinning up a 
 * dedicated database, we log the sanitized feedback to stdout, which Google 
 * Cloud Run automatically funnels into Google Cloud Logging for secure, scalable 
 * querying.
 */
app.post('/api/feedback', feedbackLimiter, (req, res) => {
  let { rating, comment = '', page = '' } = req.body;
  comment = sanitize(comment);
  page = sanitize(page);

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


