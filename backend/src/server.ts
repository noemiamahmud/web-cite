import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import webRoutes from "./routes/webRoutes";
import searchRoutes from "./routes/searchRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/webs", webRoutes);
app.use("/api", searchRoutes);      

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});