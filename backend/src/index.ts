import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as articleRouter } from "./routes/articles.js";
import { router as healthRouter } from "./routes/health.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.use("/api/health", healthRouter);
app.use("/api/articles", articleRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));