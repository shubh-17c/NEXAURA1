import { useEffect, useState } from "react";
import { getHealth } from "./services/api";
import type { HealthResponse } from "./types/api";

type HealthState =
  | { status: "loading" }
  | { status: "success"; data: HealthResponse }
  | { status: "error"; message: string };

export default function App() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });

  useEffect(() => {
    getHealth()
      .then((data) => setHealth({ status: "success", data }))
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Unable to reach the backend.";
        setHealth({ status: "error", message });
      });
  }, []);

  return (
    <main>
      <p className="eyebrow">UNIVO</p>
      <h1>Inclusive Communication Assistant</h1>
      <p className="intro">
        The project foundation is ready. Future phases will help people
        understand information in ways that work for them.
      </p>

      <section className="health-card" aria-labelledby="health-heading">
        <h2 id="health-heading">Foundation status</h2>
        {health.status === "loading" && <p role="status">Checking the backend…</p>}
        {health.status === "success" && (
          <p className="success" role="status">
            Backend connected · {health.data.status}
          </p>
        )}
        {health.status === "error" && (
          <p className="error" role="alert">
            {health.message}
          </p>
        )}
      </section>
    </main>
  );
}