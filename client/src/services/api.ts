import type {
  AnalyzeRequest,
  AnalyzeResponse,
  HealthResponse,
} from "../types/api";

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error(`Backend health check failed (${response.status}).`);
  }

  return response.json() as Promise<HealthResponse>;
}

export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  const request: AnalyzeRequest = { text };
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const body = (await response.json()) as
    | AnalyzeResponse
    | { error?: string };

  if (!response.ok) {
    throw new Error(
      "error" in body && body.error
        ? body.error
        : `Analysis request failed (${response.status}).`,
    );
  }

  return body as AnalyzeResponse;
}