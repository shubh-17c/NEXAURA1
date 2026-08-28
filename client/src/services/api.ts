import type {
  AnalyzeRequest,
  AnalyzeResponse,
  HealthResponse,
} from "../types/api";

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function getHealth(): Promise<HealthResponse> {
  let response: Response;

  try {
    response = await fetch("/api/health");
  } catch {
    throw new Error("Unable to reach the UNIVO backend.");
  }

  if (!response.ok) {
    throw new Error(`Backend health check failed (${response.status}).`);
  }

  return (await readJson(response)) as HealthResponse;
}

export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  const request: AnalyzeRequest = { text };
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    const body = (await readJson(response)) as
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
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "This is taking longer than expected. Check the connection and try again.",
      );
    }

    if (error instanceof TypeError) {
      throw new Error("Unable to reach the UNIVO backend.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}