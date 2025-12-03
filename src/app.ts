import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes"; // ⭐ routes/index.ts 자동 연결
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    time: new Date(),
  });
});

// API root
app.use("/api", router);

// Error handler (항상 마지막!)
app.use(errorHandler);

export default app;
