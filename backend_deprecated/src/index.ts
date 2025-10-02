// src/index.ts
import express from "express";
import type { Express, Request } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { router as uploadRouter } from "./routes/uploads.js";
import { router as articleRouter } from "./routes/articles.js";

dotenv.config();

const app: Express = express();
app.use(express.json({ limit: "5mb" }));

morgan.token("body", (req: Request) => JSON.stringify(req.body));
morgan.token("params", (req: Request) => JSON.stringify(req.params) || "-");
app.use(morgan(':method :url :status :res[content-length] - :response-time ms | body: :body | params: :params'));

// serve uploaded files
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/uploads", uploadRouter);
app.use("/api/articles", articleRouter);

const PORT = process.env.EXPRESS_PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});

export { app, server };