# UNIVO

## Run configuration

The `Start application` workflow runs `npm run dev` and exposes the Vite frontend on port 5000. The Express API runs alongside it on port 3001, with Vite proxying `/api` requests to the backend.

## Local commands

```bash
npm install
npm run dev
npm run build
```

The current implementation is intentionally a foundation only. See `docs/AI_CONTEXT.md` before adding product features.