import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import searchRoutes from "./routes/searchRoutes";
import webRoutes from "./routes/webRoutes";

import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ HEALTH CHECK (NOW GUARANTEED TO EXIST)
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ✅ ROUTES (NOW MATCH FRONTEND)
app.use("/api/auth", authRoutes);
app.use("/api", searchRoutes);     // /api/articles
app.use("/api/webs", webRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
