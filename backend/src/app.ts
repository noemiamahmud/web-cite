import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import searchRoutes from "./routes/searchRoutes";
import webRoutes from "./routes/webRoutes";

import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Allow frontend to connect
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Health-check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/webs", webRoutes);

app.use(errorHandler);

export default app;
