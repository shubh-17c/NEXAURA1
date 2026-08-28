import { Router } from "express";
import type { HealthResponse } from "../../shared/types";

const router = Router();

router.get("/health", (_request, response) => {
  const payload: HealthResponse = {
    status: "ok",
  };

  response.json(payload);
});

export default router;