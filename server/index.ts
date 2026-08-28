import express from "express";
import healthRouter from "./routes/health";
import analyzeRouter from "./routes/analyze";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());
app.use("/api", healthRouter);
app.use("/api", analyzeRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`UNIVO API listening on port ${port}`);
});