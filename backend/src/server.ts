import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pipelineRouter from "./routes/pipeline.js";
import contactRouter from "./routes/contacts.js";
import recordRouter from "./routes/records.js";
import reportsRouter from "./routes/reports.js";
import notificationsRouter from "./routes/notifications.js";

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
app.use("/api/records", recordRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/notifications", notificationsRouter);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
