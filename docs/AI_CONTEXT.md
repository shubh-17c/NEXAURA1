# Context for AI Coding Agents

## What UNIVO is

UNIVO (Inclusive Communication Assistant) will transform complex information into simpler, clearer, and more accessible formats based on an individual's explicit communication preferences and needs.

## Product vision

The product should help people understand and work with information in formats that suit them. It should personalize communication without making medical judgments or diagnosing disabilities.

## Core features planned

- Complex information to simple language
- Long information to concise key points
- Step-by-step explanations
- Speech-to-text and text-to-speech
- Translation
- Accessibility preferences
- Personalized communication
- Document and image input
- Chat and history

## Current status

This is the Phase 1 project foundation. The React frontend can reach the Express backend health endpoint through the Vite proxy. No product workflow has been built yet.

## Architecture

- Frontend: `client/`
  - `src/App.tsx` contains the minimal foundation screen.
  - `src/services/` contains browser-to-API calls.
  - `src/types/` contains frontend-facing API contracts.
- Backend: `server/`
  - `index.ts` creates the Express application.
  - `routes/` contains REST route modules.
  - `services/` is reserved for input processing and AI provider adapters.
  - `middleware/` is reserved for cross-cutting request concerns.
- Shared contracts: `shared/types/`
- Product and API planning: `docs/`

## Important decisions

- React, Vite, Express, and TypeScript are used without a database or authentication in the foundation phase.
- The frontend uses relative `/api` URLs; Vite proxies them to the local backend in development.
- AI logic must remain in backend services, not React components.
- User preferences are explicit inputs to adaptation, not inferred diagnoses.

## Rules for modifying this project

- Read the relevant documentation before adding a feature.
- Keep changes within the correct frontend, backend, shared, or documentation boundary.
- Add a shared type when a contract is used by both frontend and backend.
- Validate API input at the backend boundary.
- Put future credentials in environment variables and update `.env.example` with names only.
- Do not add a database, authentication, AI service, or large dependency without a planned product need.

## Safely adding a feature

1. Define the user flow and API contract in `docs/API.md`.
2. Add or update shared types in `shared/types/`.
3. Add backend route validation and service logic in `server/`.
4. Add the frontend service call and UI in `client/`.
5. Add tests for the new behavior before changing unrelated areas.
6. Update the roadmap and documentation.

## Things an agent must not change unnecessarily

- Do not replace the React/Vite/Express stack.
- Do not move AI provider calls into the browser.
- Do not add fake data, placeholder product features, or speculative integrations.
- Do not add authentication or persistence before its planned phase.
- Do not hard-code API keys.

## Known limitations

Only the health check exists. There is no user account, accessibility profile, AI processing, persistence, upload handling, speech support, translation, history, or production deployment.