# 🗳️ VoteGuide India
### Indian Election Education Portal — Google India PromptWars Hackathon

[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google)](https://ai.google.dev/)
[![Google Maps](https://img.shields.io/badge/Maps-Google%20Maps%20API-34A853?logo=google-maps)](https://developers.google.com/maps)
[![Google Analytics](https://img.shields.io/badge/Analytics-GA4-F4B400?logo=google-analytics)](https://analytics.google.com)
[![Cloud Run](https://img.shields.io/badge/Deployed-Cloud%20Run-4285F4?logo=google-cloud)](https://cloud.google.com/run)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Chosen Vertical
**Election Process Education** — An interactive portal that helps every Indian citizen understand the election process, timelines, and steps in a clear, accessible, and visual way.

---

## Approach & Logic

**Problem:** Millions of Indian citizens — especially first-time voters, rural residents, and senior citizens — do not fully understand how elections work, how to register, or what happens on election day.

**Solution:** VoteGuide India is a plain-English educational portal with an AI-powered chatbot, Google Maps office locator, and structured visual guides — designed to look and feel like an official Indian government portal (GoI visual language, WCAG 2.1 AA compliance).

---

## How the Solution Works

```
User opens VoteGuide India
│
├── Home         → Stats, 7-step visual overview, feature navigation
├── Process      → Interactive 7-step accordion guide with facts
├── Types        → Lok Sabha / Rajya Sabha / Vidhan Sabha + comparison table
├── Office Map   → Google Maps with 32 ECI state office markers
├── FAQs         → Accordion FAQ, voter eligibility, registration steps
└── Ask Guide    → Gemini AI chatbot (full conversation history)
                   └── /api/chat → Express → Gemini 1.5 Flash → response
```

Every page includes a **FeedbackWidget** that logs structured star ratings to **Google Cloud Logging** via the server's stdout.

---

## Google Services Used

| Service | How It's Used |
|---------|---------------|
| **Google Gemini 1.5 Flash** | Powers the AI election chatbot with a custom system prompt |
| **Google Maps JavaScript API** | Interactive map with 32 ECI office markers across all states/UTs |
| **Google Maps Embed API** | Fallback iframe when JS API has rendering issues |
| **Google Analytics 4 (GA4)** | Tracks page views, feature card clicks, step expansions, FAQ opens, chat messages, and feedback submissions |
| **Google Cloud Run** | Hosts the containerised Node.js + React app (mandatory) |
| **Google Cloud Logging** | Structured JSON feedback and request logs emitted to stdout, collected automatically by Cloud Run |

---

## GenAI Integration & Tool Usage (Hackathon Validation)

As part of the **PromptWars Virtual** hackathon, this project heavily integrates AI tools to accelerate development and enhance the user experience. For a complete breakdown, please see our [Dev Blog](DEV_BLOG.md) and [LinkedIn Post Draft](LINKEDIN_POST.md).

### Which Tools Were Used & Why?
- **Google Gemini 1.5 Flash:** Chosen for its low latency and robust safety guardrails, making it ideal for the sensitive topic of Indian elections. It powers the "Ask Guide" chatbot.
- **AI Coding Assistants:** Used to rapidly scaffold React components, debug complex state issues, and configure Google Cloud deployment scripts, allowing more focus on human-centric design.

### Prompt Evolution
Prompts for the Gemini chatbot evolved from generic (`"You are an election assistant"`) to highly specific, constraint-bound instructions (`"You are an official, politically neutral guide for the Indian electoral process... Under no circumstances should you endorse a candidate..."`) to ensure safety, neutrality, and factual accuracy.

### GenAI vs. Human Design
- **GenAI Handled:** Boilerplate generation, CSS debugging, chatbot API routing, and dynamic query responses.
- **Human Designed:** The GoI-inspired UI/UX, WCAG 2.1 AA accessibility implementation, Google Maps data curation, and the overarching system architecture.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| Styling | Pure CSS — Government of India design system |
| Backend | Node.js, Express 4 |
| AI | `@google/generative-ai` SDK |
| Security | Helmet, CORS, Rate Limiting, Input Validation |
| Logging | Morgan (HTTP) + structured JSON to stdout |
| Container | Docker (multi-stage build) |
| Deployment | Google Cloud Run |

---

## Setup & Run Locally

### Prerequisites
- Node.js 20+
- A [Gemini API Key](https://aistudio.google.com/app/apikey)
- A [Google Maps API Key](https://console.cloud.google.com/apis/credentials) (enable Maps JavaScript API)
- A [GA4 Measurement ID](https://analytics.google.com) — optional

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/voteguide-india.git
cd voteguide-india

# 2. Configure environment
cp .env.example .env
# Edit .env — add GEMINI_API_KEY and VITE_GOOGLE_MAPS_API_KEY

# 3. Install and build
npm install
npm run build

# 4. Start server
npm start
# → http://localhost:8080
```

### Development (hot reload)
```bash
# Terminal 1 — backend
npm start

# Terminal 2 — frontend with HMR
npx vite
# → http://localhost:5173
```

---

## Deploy to Google Cloud Run

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy directly from source (Cloud Build handles the Docker build)
gcloud run deploy voteguide-india \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=YOUR_KEY,VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY,VITE_GA4_MEASUREMENT_ID=G-XXXXXXXX,NODE_ENV=production"
```

---

## Project Structure

```
voteguide-india/
├── server/
│   └── index.js              # Express + Gemini + Cloud Logging
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Navigation with tricolour bar
│   │   ├── Footer.jsx         # Links, ECI resources
│   │   └── FeedbackWidget.jsx # Star rating → Cloud Logging
│   ├── pages/
│   │   ├── HomePage.jsx       # Hero, stats, 7-step visual
│   │   ├── ProcessPage.jsx    # Interactive accordion steps
│   │   ├── TypesPage.jsx      # Lok/Rajya/Vidhan Sabha + table
│   │   ├── MapPage.jsx        # Google Maps ECI office locator
│   │   ├── FAQPage.jsx        # Accordion FAQ + voter eligibility
│   │   └── ChatPage.jsx       # Gemini AI chatbot
│   ├── hooks/
│   │   └── useGoogleServices.js  # GA4 + Feedback hooks
│   ├── data/
│   │   └── electionData.js    # All election content + ECI offices
│   ├── styles/
│   │   └── global.css         # GoI design system
│   ├── App.jsx                # Routing + GA4 page views
│   └── main.jsx               # Entry point
├── index.html                 # GA4 script loader
├── Dockerfile                 # Multi-stage build
├── vite.config.js
├── package.json
└── .env.example
```

---

## Accessibility (WCAG 2.1 AA)

- Skip-to-main-content link for keyboard users
- Semantic HTML (`main`, `nav`, `header`, `footer`, `article`, `section`, `ol`, `ul`)
- `aria-expanded` on all accordion/toggle buttons
- `aria-live="polite"` on chat window and map info panel
- `aria-label` on all interactive elements and regions
- `role="log"` on chat conversation window
- `aria-current="page"` on active navigation item
- `aria-busy` on loading buttons
- Focus indicators on all interactive elements (3px orange outline)
- Minimum 4.5:1 colour contrast ratio throughout
- `.sr-only` class for screen-reader-only text

---

## Content Coverage

- 7 stages of Indian elections (Announcement → Government Formation)
- Lok Sabha, Rajya Sabha, Vidhan Sabha — full comparison table
- Voter registration (online and offline, Form 6)
- EVM operation and VVPAT verification
- Model Code of Conduct rules
- NOTA and the FPTP voting system
- Voter eligibility criteria
- Candidate nomination process
- All 32 state and UT ECI office locations on Google Maps

---

## Assumptions

1. Content targets Indian citizens; ECI-conducted elections only
2. The portal is educational and politically neutral — Gemini is system-prompted accordingly
3. All API keys are provided via environment variables (never hardcoded)
4. Local body (Panchayat/Municipal) elections are briefly noted but not the primary focus
5. Google Maps markers use publicly available ECI office coordinates

---

## Security Highlights

- API keys stored in environment variables only
- Gemini API called server-side — key never exposed to client
- Helmet sets strict Content Security Policy
- Rate limiting on `/api/chat` (20 req/min) and `/api/feedback` (10/5 min)
- Input length validation and type checks on all POST endpoints
- Gemini safety filters set to BLOCK_MEDIUM_AND_ABOVE for all harm categories

---

*Built for Google India PromptWars Virtual Hackathon · Powered by Google Gemini, Google Maps, Google Analytics, and Google Cloud Run*
