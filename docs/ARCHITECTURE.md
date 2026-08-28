# UNIVO Architecture

## Intended request flow

UNIVO will use a simple REST architecture:

```text
User input
  ↓
Frontend input processing
  ↓
Express API
  ↓
AI communication service
  ↓
User accessibility profile
  ↓
Adapted output
  ↓
User feedback / chat loop
```

The frontend is responsible for presenting accessible controls, collecting explicit user preferences, and rendering responses. The backend owns request validation, orchestration, provider adapters, and future persistence boundaries. AI provider logic belongs in backend services so that the provider or model can change without rewriting the frontend.

## Current implementation

- `client/` is a Vite-powered React application.
- `server/` is an Express API.
- `shared/` holds contracts used by both sides.
- Vite serves the frontend on port 5000 and proxies `/api` to the backend on port 3001.
- `GET /api/health` is the only implemented API route.
- There is no database, authentication, AI provider, or external service.

## Boundaries and principles

- Keep frontend and backend code clearly separated.
- Keep AI integrations behind backend service interfaces.
- Adapt communication using stated user preferences; never diagnose disabilities.
- Keep credentials in environment variables and never commit them.
- Prefer small, independently testable REST routes.