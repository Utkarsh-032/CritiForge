# CritiForge

> **Review. Improve. Ship.**

CritiForge is an AI engineering workspace for structured website reviews, code reviews, and educational mentor guidance. Rather than presenting a generic chatbot interface, it turns an input into a focused report with scores, findings, recommendations, and clear next steps.

## Overview

CritiForge helps developers assess a public website, review HTML/CSS/JavaScript, or work through an engineering question. Website Review combines safely collected webpage evidence with a rendered screenshot. Code Review and AI Mentor provide structured Groq-powered responses, while Website Review uses Gemini for visual analysis.

## Problem

Finding UI, accessibility, code-quality, security, and maintainability issues often requires switching between several tools and translating scattered observations into practical actions. CritiForge brings those review workflows into one workspace with consistent, structured output.

## Features

- **Website Review** — evidence-based review of UI, UX, accessibility, content, responsiveness, and performance readiness.
- **Code Review** — structured feedback for HTML, CSS, and JavaScript, including quality, security, maintainability, and best-practice signals.
- **AI Mentor** — educational reports for debugging, architecture, best practices, and concept explanations.
- **Structured report visualizations** — scores, findings, strengths, and prioritized recommendations.
- **Review-history dashboard** — browser-local history of completed reviews.
- **Search and filters** — search, filter, sort, and clear locally saved review history.
- **Responsive premium interface** — desktop sidebar, compact mobile navigation, accessible loading/error states, and deep-black visual styling.

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion

### Backend

- Node.js
- Express
- Playwright
- Cheerio

### AI

- Groq — Code Review and AI Mentor
- Gemini — screenshot-based Website Review

### Deployment

- Vercel frontend
- Render Docker backend
- GitHub

## Architecture

The React frontend calls the Express API through `VITE_API_BASE_URL`. Code Review and AI Mentor are sent to their respective Groq workflows. For Website Review, the backend validates the URL, applies SSRF protections, fetches bounded HTML evidence, renders a screenshot with Playwright, and sends the structured evidence plus image to Gemini. Provider output is validated against a Zod response schema before it is returned to the frontend.

Website screenshots are held in memory only. The dashboard stores compact completed-review metadata in browser `localStorage`; it does not store screenshots, page HTML, API keys, or complete report payloads.

## Local Setup

### Prerequisites

- Node.js 20+ recommended
- npm
- A Groq API key and Gemini API key
- Playwright Chromium available for local Website Review

### 1. Install dependencies

```powershell
# From the repository root
npm install

# Backend dependencies
cd apps/server
npm install
```

### 2. Configure environment files

Create a root `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Create `apps/server/.env` from `apps/server/.env.example` and add your own values:

```env
GROQ_API_KEY=
GROQ_MODEL=
GEMINI_API_KEY=
GEMINI_VISION_MODEL=
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Run the application

In one terminal:

```powershell
cd apps/server
npm start
```

In a second terminal, from the repository root:

```powershell
npm run dev
```

The frontend is served by Vite and the API defaults to `http://localhost:3001/api`.

## Environment Variables

| Variable              | Used by  | Purpose                                                        |
| --------------------- | -------- | -------------------------------------------------------------- |
| `VITE_API_BASE_URL`   | Frontend | Base URL for the API, for example `http://localhost:3001/api`. |
| `GROQ_API_KEY`        | Backend  | Credentials for Code Review and AI Mentor.                     |
| `GROQ_MODEL`          | Backend  | Groq text model used by Code Review and AI Mentor.             |
| `GEMINI_API_KEY`      | Backend  | Credentials for Website Review.                                |
| `GEMINI_VISION_MODEL` | Backend  | Gemini model used for screenshot-based Website Review.         |
| `FRONTEND_ORIGIN`     | Backend  | Allowed frontend origin(s) for CORS.                           |
| `NODE_ENV`            | Backend  | Environment mode, such as `development` or `production`.       |

Never expose API keys in frontend environment variables or commit real `.env` files.

## API Endpoints

| Method | Endpoint               | Description                                                                                                       |
| ------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/health`          | Basic API health check.                                                                                           |
| `GET`  | `/api/ai/status`       | Safe provider/model configuration status; never returns keys.                                                     |
| `POST` | `/api/reviews/website` | Creates a Website Review from `{ "url": "https://..." }`. Optional `force` bypasses the short-lived review cache. |
| `POST` | `/api/reviews/code`    | Creates a Code Review from `language` and `code`.                                                                 |
| `POST` | `/api/mentor`          | Creates an AI Mentor report from `question` and optional `context`.                                               |

## Security and Reliability

- Provider keys remain backend-only.
- Website URLs are validated and checked against private/local network targets to reduce SSRF risk.
- Request bodies and code/mentor inputs have bounded sizes.
- AI responses are validated against structured Zod schemas before use.
- Browser pages, contexts, and shared Chromium resources are safely cleaned up.
- API errors return safe messages rather than stack traces.
- Helmet, CORS restrictions, and rate limiting protect the API surface.

## How Codex and GPT-5.6 Terra Were Used

Codex was used throughout the project for architecture planning, implementation, debugging, refactoring, deployment preparation, performance improvements, and documentation. GPT-5.6 Terra/Codex-assisted work supported the iterative engineering process; I reviewed, tested, and understood the generated code and decisions before using them in the project.

## Limitations

- Review history is stored in browser `localStorage`, not a shared cloud account.
- Free Render deployments can experience cold starts.
- Website Review is evidence-based and is not a measured Lighthouse or Core Web Vitals benchmark.
- Groq and Gemini free-tier limits, availability, and rate limits may apply.

## Future Improvements

- Accounts and cloud-synced review history
- Team workspaces
- Report export
- Automated repository analysis
- Measured Lighthouse integration

## Live Links

- Live application: `[add Vercel URL]`
- Backend health endpoint: `[add Render URL]/api/health`
- Demo video: `[add video URL]`
- Devpost submission: `[add Devpost URL]`

## Screenshots

Replace these placeholders with your final screenshots before submission.

```text
docs/screenshots/dashboard.png
docs/screenshots/website-review.png
docs/screenshots/code-review.png
docs/screenshots/ai-mentor.png
```

## Verification

```powershell
npm run lint
npm run build

cd apps/server
node --check src/server.js
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
