import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pipelineRouter from "./routes/pipeline.js";
import contactRouter from "./routes/contacts.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/pipeline", pipelineRouter);
app.use("/api/contacts", contactRouter);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
