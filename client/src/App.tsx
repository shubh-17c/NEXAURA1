import { useEffect, useState } from "react";
import { analyzeText, getHealth } from "./services/api";
import type { AnalyzeResponse, HealthResponse } from "./types/api";

type HealthState =
  | { status: "loading" }
  | { status: "success"; data: HealthResponse }
  | { status: "error"; message: string };

export default function App() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    getHealth()
      .then((data) => setHealth({ status: "success", data }))
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Unable to reach the backend.";
        setHealth({ status: "error", message });
      });
  }, []);

  async function handleAnalyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      setAnalysisError("Enter some text before analyzing.");
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");

    try {
      const result = await analyzeText(trimmedText);
      setAnalysis(result);
    } catch (error: unknown) {
      setAnalysis(null);
      setAnalysisError(
        error instanceof Error ? error.message : "Unable to analyze the text.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main>
      <p className="eyebrow">UNIVO</p>
      <h1>Communication engine</h1>
      <p className="intro">
        Enter complex text to test a clearer, more accessible explanation.
      </p>

      <section className="health-card" aria-labelledby="health-heading">
        <h2 id="health-heading">Backend status</h2>
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

      <form className="analyze-form" onSubmit={handleAnalyze}>
        <label htmlFor="source-text">Text to analyze</label>
        <textarea
          id="source-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste a complex paragraph here…"
          rows={8}
          maxLength={20_000}
        />
        <button type="submit" disabled={isAnalyzing}>
          {isAnalyzing ? "Analyzing…" : "Analyze"}
        </button>
      </form>

      {analysisError && (
        <p className="error" role="alert">
          {analysisError}
        </p>
      )}

      {analysis && (
        <section className="results" aria-labelledby="results-heading">
          <h2 id="results-heading">Analysis</h2>

          <div className="result-section">
            <h3>Simple explanation</h3>
            <p>{analysis.simpleExplanation}</p>
          </div>

          <div className="result-section">
            <h3>Key points</h3>
            <ul>
              {analysis.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h3>Step-by-step explanation</h3>
            <ol>
              {analysis.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="result-section">
            <h3>Difficult words</h3>
            {analysis.difficultWords.length === 0 ? (
              <p>No difficult words were identified.</p>
            ) : (
              <dl>
                {analysis.difficultWords.map(({ word, meaning }) => (
                  <div className="word" key={word}>
                    <dt>{word}</dt>
                    <dd>{meaning}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}
    </main>
  );
}