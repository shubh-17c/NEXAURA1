# UNIVO

UNIVO is an AI-powered Inclusive Communication Assistant that will transform complex information into simpler, clearer, and more accessible formats based on explicit user preferences. This repository is the initial project foundation: it contains a React frontend, an Express backend, a shared type boundary, and the documentation needed to build the product safely in later phases.

## Problem statement

Information is often presented in formats that may be difficult for people with different communication or cognitive needs to understand. UNIVO will adapt communication to a person's stated preferences without diagnosing disabilities.

## Current status

Phase 1 foundation is complete. The frontend runs through Vite, the backend exposes `GET /api/health`, and the frontend checks that endpoint through the Vite development proxy. Product features are intentionally not implemented yet.

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

The frontend is available on port 5000. The backend listens on port 3001. Run the foundation check with:

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

Copy `.env.example` to `.env` when environment configuration is needed. No environment variables are required for the current foundation, and no secrets are committed.

## Development rules

- Keep frontend and backend responsibilities separate.
- Keep AI provider logic isolated in backend services when it is introduced.
- Use explicit user preferences; do not diagnose disabilities.
- Use environment variables for future API credentials.
- Avoid adding dependencies or features unless they are required by the current phase.

## Not implemented yet

Landing page, authentication, database, AI communication features, speech, translation, file uploads, chat history, personalization, and production deployment are intentionally out of scope for this scaffold. See `docs/ROADMAP.md`.