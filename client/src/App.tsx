import { useEffect, useRef, useState } from "react";
import { analyzeText, getHealth } from "./services/api";
import type { AnalyzeResponse, HealthResponse } from "./types/api";
import type { FormEvent } from "react";

type HealthState =
  | { status: "loading" }
  | { status: "success"; data: HealthResponse }
  | { status: "error"; message: string };

const MAX_INPUT_LENGTH = 20_000;

export default function App() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const resultsRef = useRef<HTMLElement | null>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    getHealth()
      .then((data) => setHealth({ status: "success", data }))
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Unable to reach the backend.";
        setHealth({ status: "error", message });
      });
  }, []);

  useEffect(() => {
    if (analysis) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultsHeadingRef.current?.focus();
    }
  }, [analysis]);

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      setAnalysisError("Paste or type some text before analyzing.");
      setAnalysis(null);
      return;
    }

    if (trimmedText.length > MAX_INPUT_LENGTH) {
      setAnalysisError(
        `Your text is too long. Keep it under ${MAX_INPUT_LENGTH.toLocaleString()} characters.`,
      );
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

  function handleClear() {
    setText("");
    setAnalysis(null);
    setAnalysisError("");
  }

  const characterCount = text.length.toLocaleString();
  const healthLabel =
    health.status === "loading"
      ? "Checking connection"
      : health.status === "success"
        ? "AI ready"
        : "Backend unavailable";

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="UNIVO home">
          <span className="logo-mark" aria-hidden="true">
            U
          </span>
          <span className="brand-name">univo</span>
        </a>
        <div
          className={`status-pill status-pill--${health.status}`}
          role="status"
          aria-live="polite"
        >
          <span className="status-dot" aria-hidden="true" />
          {healthLabel}
        </div>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span aria-hidden="true">✦</span> Inclusive communication
          </p>
          <h1 id="page-title">Make complex information easier to understand.</h1>
          <p className="hero-lede">
            Paste something confusing and UNIVO will turn it into clear meaning,
            useful next steps, and words you can act on.
          </p>
          <div className="trust-row" aria-label="UNIVO principles">
            <span className="trust-item">
              <span aria-hidden="true">✓</span> Keeps your meaning intact
            </span>
            <span className="trust-item">
              <span aria-hidden="true">✓</span> No diagnosis or assumptions
            </span>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit-ring orbit-ring--outer" />
          <div className="orbit-ring orbit-ring--inner" />
          <div className="orbit-core">
            <span>U</span>
          </div>
          <span className="orbit-label orbit-label--top">clarity</span>
          <span className="orbit-label orbit-label--bottom">for everyone</span>
        </div>
      </section>

      <div className="flow-strip" aria-label="How UNIVO works">
        <div className="flow-step">
          <span className="flow-number">01</span>
          <span>Paste your text</span>
        </div>
        <span className="flow-arrow" aria-hidden="true">
          →
        </span>
        <div className="flow-step">
          <span className="flow-number">02</span>
          <span>Get a clearer view</span>
        </div>
        <span className="flow-arrow" aria-hidden="true">
          →
        </span>
        <div className="flow-step">
          <span className="flow-number">03</span>
          <span>Know what to do next</span>
        </div>
      </div>

      <section className="workspace-grid" aria-label="UNIVO communication assistant">
        <section className="card input-card" aria-labelledby="input-heading">
          <div className="card-heading">
            <div>
              <p className="card-kicker">Start here</p>
              <h2 id="input-heading">What would you like to understand?</h2>
            </div>
            <span className="step-chip">1</span>
          </div>
          <p className="card-description">
            Paste an email, policy, instructions, or any text that feels hard to
            follow.
          </p>

          <form className="analyze-form" onSubmit={handleAnalyze}>
            <label htmlFor="source-text">Your text</label>
            <div className="textarea-wrap">
              <textarea
                id="source-text"
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  if (analysisError) setAnalysisError("");
                }}
                placeholder="Paste difficult or confusing text here…"
                rows={10}
                maxLength={MAX_INPUT_LENGTH}
                aria-describedby="input-helper input-count"
                aria-invalid={Boolean(analysisError)}
                autoComplete="off"
              />
              {text && (
                <button
                  className="clear-button"
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear text and results"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="input-meta">
              <span id="input-helper">Your text stays in this conversation.</span>
              <span id="input-count">
                {characterCount} / {MAX_INPUT_LENGTH.toLocaleString()}
              </span>
            </div>
            {analysisError && (
              <p className="field-error" role="alert">
                {analysisError}
              </p>
            )}
            <button className="primary-button" type="submit" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Understanding…
                </>
              ) : (
                <>
                  <span aria-hidden="true">✦</span>
                  Make it clearer
                </>
              )}
            </button>
          </form>

          <p className="privacy-note">
            <span aria-hidden="true">◌</span> Your text is only used to create this
            explanation.
          </p>
        </section>

        <section
          className={`card results-panel ${analysis ? "results-panel--filled" : ""}`}
          ref={resultsRef}
          aria-labelledby="results-heading"
        >
          {!analysis && !isAnalyzing && !analysisError && (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                <span>✦</span>
              </div>
              <p className="card-kicker">Your clearer view</p>
              <h2 id="results-heading">Your explanation will appear here.</h2>
              <p>
                Submit a piece of text to see its meaning, key points, next steps,
                and simpler definitions.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="loading-state" role="status" aria-live="polite">
              <div className="loading-icon" aria-hidden="true">
                <span className="spinner spinner--large" />
              </div>
              <p className="card-kicker">Working on it</p>
              <h2 id="results-heading">Finding the clearest way to say this…</h2>
              <p>
                UNIVO is keeping the important details while making the language
                easier to follow.
              </p>
              <div className="loading-lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {!isAnalyzing && analysisError && (
            <div className="error-state" role="alert">
              <div className="error-icon" aria-hidden="true">
                !
              </div>
              <p className="card-kicker">Something got in the way</p>
              <h2 id="results-heading">We couldn’t make that clearer yet.</h2>
              <p>{analysisError}</p>
              <p className="error-hint">
                Check your connection and try submitting the text again.
              </p>
            </div>
          )}

          {analysis && !isAnalyzing && (
            <div className="results-content">
              <div className="results-header">
                <div>
                  <p className="card-kicker">Your clearer view</p>
                  <h2 id="results-heading" tabIndex={-1} ref={resultsHeadingRef}>
                    Here’s what it means
                  </h2>
                </div>
                <span className="result-badge">
                  <span aria-hidden="true">✓</span> Ready
                </span>
              </div>

              <article className="result-card result-card--highlight">
                <div className="result-card-heading">
                  <span className="result-icon" aria-hidden="true">
                    01
                  </span>
                  <h3>Simple explanation</h3>
                </div>
                <p>{analysis.simpleExplanation}</p>
              </article>

              <div className="result-columns">
                <article className="result-card">
                  <div className="result-card-heading">
                    <span className="result-icon result-icon--soft" aria-hidden="true">
                      02
                    </span>
                    <h3>Key points</h3>
                  </div>
                  {analysis.keyPoints.length > 0 ? (
                    <ul className="result-list">
                      {analysis.keyPoints.map((point, index) => (
                        <li key={`${point}-${index}`}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-inline">No key points were identified.</p>
                  )}
                </article>

                <article className="result-card">
                  <div className="result-card-heading">
                    <span className="result-icon result-icon--soft" aria-hidden="true">
                      03
                    </span>
                    <h3>Step-by-step</h3>
                  </div>
                  {analysis.steps.length > 0 ? (
                    <ol className="result-list steps-list">
                      {analysis.steps.map((step, index) => (
                        <li key={`${step}-${index}`}>{step}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="empty-inline">No specific steps were identified.</p>
                  )}
                </article>
              </div>

              <article className="result-card terms-card">
                <div className="result-card-heading">
                  <span className="result-icon result-icon--soft" aria-hidden="true">
                    04
                  </span>
                  <div>
                    <h3>Difficult words, made simpler</h3>
                    <p className="result-subtitle">
                      Terms from your text explained in plain language.
                    </p>
                  </div>
                </div>
                {analysis.difficultWords.length > 0 ? (
                  <dl className="term-list">
                    {analysis.difficultWords.map(({ word, meaning }, index) => (
                      <div className="term-item" key={`${word}-${index}`}>
                        <dt>{word}</dt>
                        <dd>{meaning}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="empty-inline">No difficult words were identified.</p>
                )}
              </article>
            </div>
          )}
        </section>
      </section>

      <footer className="app-footer">
        <span className="footer-mark" aria-hidden="true">
          U
        </span>
        UNIVO helps make information easier to understand—without changing what it
        means.
      </footer>
    </main>
  );
}