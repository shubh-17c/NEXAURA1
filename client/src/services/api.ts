import type { HealthResponse } from "../types/api";

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error(`Backend health check failed (${response.status}).`);
  }

  return response.json() as Promise<HealthResponse>;
}