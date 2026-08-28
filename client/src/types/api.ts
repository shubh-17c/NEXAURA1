export interface HealthResponse {
  status: "ok";
}

export interface AnalyzeRequest {
  text: string;
}

export interface DifficultWord {
  word: string;
  meaning: string;
}

export interface AnalyzeResponse {
  simpleExplanation: string;
  keyPoints: string[];
  steps: string[];
  difficultWords: DifficultWord[];
}