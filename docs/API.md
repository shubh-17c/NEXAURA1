# UNIVO API

## API conventions

The API is a JSON REST API served by the Express backend. Routes are prefixed with `/api`. Request and response contracts should be added to `shared/types/` when they are shared with the frontend.

## Implemented

### `GET /api/health`

Returns a basic service status response.

Example response:

```json
{
  "status": "ok",
  "service": "univo-api"
}
```

## Planned endpoints

The following endpoints are planned and are **not implemented** unless noted above:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/chat` | Send a message through the communication assistant |
| `POST` | `/api/analyze` | Simplify, summarize, or structure supplied information |
| `POST` | `/api/upload` | Accept a supported document or image for analysis |
| `POST` | `/api/speech/transcribe` | Convert speech input to text |
| `POST` | `/api/speech/synthesize` | Convert adapted text to speech |
| `POST` | `/api/translate` | Translate adapted communication |
| `GET` | `/api/history` | Retrieve a user's previous conversations |
| `POST` | `/api/preferences` | Save explicit accessibility and communication preferences |

Before implementing a planned endpoint, define its validation, authorization needs, error format, provider boundary, and shared types.