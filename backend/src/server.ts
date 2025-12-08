import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import webRoutes from "./routes/webRoutes";
import searchRoutes from "./routes/searchRoutes";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/webs", webRoutes);
app.use("/api", searchRoutes);       

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("MongoDB connected");

    // Start server only AFTER DB connects
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // stop server if DB fails
});