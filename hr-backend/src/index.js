import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import authRoutes from "./routes/Auth/auth.routes.js";
import Routes from "./routes/Routes.js";
import { logger } from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../config/config-eles.env"),
  override: true, // később kilehet venni az override-ot ha kell
});

const app = express();

const whitelist = ["http://localhost:3000", "https://localhost:3000"];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitelist.includes(req.header("Origin"))) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.use(json());

// DB connect
connectDB();

// API route-ok
app.use("/api", Routes);
app.use("/api/auth", authRoutes);

// Hibakezelő middleware
app.use(ErrorHandler);

// Szerver indítása
const port = process.env.PORT || 5000;
app
  .listen(port, () => {
    logger.info(
      `Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${port}`
    );
  })
  .on("error", (e) => {
    logger.error(`Server error: ${e.message}`);
  });
