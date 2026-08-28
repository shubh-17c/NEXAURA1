import type { AnalyzeResponse, DifficultWord } from "../../shared/types";

const DEFAULT_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models";

const COMMUNICATION_PROMPT = `You are an accessibility-focused communication assistant.

Your task is NOT to change the meaning of the user's information. Transform complex information into clearer and more accessible language.

Rules:
- Preserve the original meaning.
- Do not invent facts.
- Do not remove important conditions, warnings, dates, numbers, or requirements.
- Use simple, natural language.
- Prefer short sentences.
- Avoid unnecessary jargon.
- Explain unavoidable technical, legal, or academic terminology.
- Make the result easy to scan.
- Do not assume the user has a disability.
- Do not diagnose or classify the user.
- Do not give medical, legal, or other advice beyond what is present in the source.
- If the source is ambiguous, preserve the ambiguity rather than inventing an interpretation.

Return ONLY valid JSON matching this exact shape:
{
  "simpleExplanation": "string",
  "keyPoints": ["string"],
  "steps": ["string"],
  "difficultWords": [
    { "word": "string", "meaning": "string" }
  ]
}

This is not a generic summarizer. Preserve important conditions, warnings, dates, numbers, requirements, and consequences from the source text.`;

export class CommunicationServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 502 | 503,
  ) {
    super(message);
    this.name = "CommunicationServiceError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function isDifficultWord(value: unknown): value is DifficultWord {
  return (
    isRecord(value) &&
    typeof value.word === "string" &&
    value.word.trim().length > 0 &&
    typeof value.meaning === "string" &&
    value.meaning.trim().length > 0
  );
}

function validateAnalysis(value: unknown): AnalyzeResponse {
  if (
    !isRecord(value) ||
    typeof value.simpleExplanation !== "string" ||
    value.simpleExplanation.trim().length === 0 ||
    !isStringArray(value.keyPoints) ||
    !isStringArray(value.steps) ||
    !Array.isArray(value.difficultWords) ||
    !value.difficultWords.every(isDifficultWord)
  ) {
    throw new CommunicationServiceError(
      "The analysis service returned an invalid response.",
      502,
    );
  }

  return {
    simpleExplanation: value.simpleExplanation,
    keyPoints: value.keyPoints,
    steps: value.steps,
    difficultWords: value.difficultWords,
  };
}

function extractModelText(value: unknown): string {
  if (!isRecord(value) || !Array.isArray(value.candidates)) {
    throw new CommunicationServiceError(
      "The analysis service returned an invalid response.",
      502,
    );
  }

  const candidate = value.candidates[0];
  if (!isRecord(candidate) || !isRecord(candidate.content)) {
    throw new CommunicationServiceError(
      "The analysis service returned an invalid response.",
      502,
    );
  }

  const parts = candidate.content.parts;
  const firstPart = Array.isArray(parts) ? parts[0] : undefined;
  if (!isRecord(firstPart) || typeof firstPart.text !== "string") {
    throw new CommunicationServiceError(
      "The analysis service returned an invalid response.",
      502,
    );
  }

  return firstPart.text;
}

export async function analyzeCommunication(text: string): Promise<AnalyzeResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new CommunicationServiceError(
      "Gemini is not configured. Add GEMINI_API_KEY to the server environment.",
      503,
    );
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const endpoint = `${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${COMMUNICATION_PROMPT}\n\nSOURCE TEXT:\n${text}` }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });
  } catch (error) {
    console.error(
      "Gemini request could not be completed:",
      error instanceof Error ? error.message : "unknown network error",
    );
    throw new CommunicationServiceError(
      "The analysis service could not be reached.",
      502,
    );
  }

  if (!response.ok) {
    console.error("Gemini request returned status", response.status);
    throw new CommunicationServiceError(
      "The analysis service could not process this text.",
      502,
    );
  }

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    throw new CommunicationServiceError(
      "The analysis service returned an invalid response.",
      502,
    );
  }

  let parsedModelResponse: unknown;
  try {
    parsedModelResponse = JSON.parse(extractModelText(responseBody));
  } catch {
    throw new CommunicationServiceError(
      "The analysis service returned an invalid response.",
      502,
    );
  }

  return validateAnalysis(parsedModelResponse);
}