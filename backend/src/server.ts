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

// --- HEALTH CHECK AT TOP ---
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile / curl

      const allowed = [
        "http://localhost:5173",
        /\.vercel\.app$/,
      ];

      if (allowed.some((pattern) => pattern instanceof RegExp ? pattern.test(origin) : pattern === origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);




// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api", searchRoutes);      // /api/articles
app.use("/api/webs", webRoutes);

app.use(errorHandler);

// --- MONGO + SERVER START ---
mongoose.set("strictQuery", false);

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
