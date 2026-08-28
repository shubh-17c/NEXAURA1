# UNIVO

UNIVO is an AI-powered Inclusive Communication Assistant that transforms complex information into simpler, clearer, and more accessible formats. The first functional MVP feature accepts complex text and returns a simple explanation, key points, steps, and difficult-word definitions while preserving the source meaning.

## Problem statement

Information is often presented in formats that may be difficult for people with different communication or cognitive needs to understand. UNIVO will adapt communication to a person's stated preferences without diagnosing disabilities.

## Current status

Phase 2 functional MVP is in progress. The frontend runs through Vite, the backend exposes `GET /api/health` and `POST /api/analyze`, and Gemini is called only by the backend when the user submits text.

## Tech stack

- React
- TypeScript
- Vite
- Node.js
- Express

## How to run

Install dependencies and start both development servers:

```bash
npm install
npm run dev
```

The frontend is available on port 5000. The backend listens on port 3001. Add `GEMINI_API_KEY` to the server environment before testing analysis. The model defaults to `gemini-2.5-flash` and can be changed with `GEMINI_MODEL`.

Run the build check with:

```bash
npm run build
```

## Project structure

```text
client/       React frontend and API client
server/       Express server and REST routes
shared/       Types shared between frontend and backend
docs/         Architecture, API, roadmap, and AI-agent context
```

## Environment variables

Copy `.env.example` to `.env` when environment configuration is needed. `GEMINI_API_KEY` is required for analysis; `GEMINI_MODEL` is optional. Firebase variables are documented for later phases only. Never commit real credentials.

## Development rules

- Keep frontend and backend responsibilities separate.
- Keep Gemini/provider logic isolated in backend services.
- Use explicit user preferences; do not diagnose disabilities.
- Keep API keys on the backend and use environment variables.
- Avoid adding dependencies or features unless they are required by the current phase.

## How to test analysis

Open the frontend, paste a complex paragraph into the text area, and select **Analyze**. The response should show a simple explanation, key points, steps, and difficult words. Empty input is rejected before an API request is made. The backend can also be checked directly:

```bash
curl http://localhost:3001/api/health
curl -X POST http://localhost:3001/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{"text":"Applicants must submit the required documents no later than 30 September. Applications received after this date will not be considered."}'
```

## Not implemented yet

Landing page, authentication, Firebase, accessibility preference profiles, speech, translation, file uploads, chat history, personalization, and production deployment remain planned. The UI is intentionally a development test interface, not the final product design. See `docs/ROADMAP.md`.