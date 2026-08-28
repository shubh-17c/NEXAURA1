import { Router } from "express";
import { analyzeCommunication, CommunicationServiceError } from "../services/communication";
import type { AnalyzeRequest } from "../../shared/types";

const router = Router();
const MAX_INPUT_LENGTH = 20_000;

router.post("/analyze", async (request, response) => {
  const body = request.body as Partial<AnalyzeRequest> | undefined;
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    response.status(400).json({ error: "Text is required." });
    return;
  }

  if (text.length > MAX_INPUT_LENGTH) {
    response
      .status(413)
      .json({ error: `Text must be ${MAX_INPUT_LENGTH} characters or fewer.` });
    return;
  }

  try {
    const result = await analyzeCommunication(text);
    response.json(result);
  } catch (error) {
    if (error instanceof CommunicationServiceError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error(
      "Unexpected analysis error:",
      error instanceof Error ? error.message : "unknown error",
    );
    response.status(500).json({ error: "Unable to analyze the text." });
  }
});

export default router;