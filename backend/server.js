require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const downloadRoutes = require("./routes/download");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ────────────────────────────────────────────────────
app.set("trust proxy", true);
app.use(helmet());

// CORS: Allow your frontend origin
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: "*", // Allow all origins to let file:/// work
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Rate Limiting: 60 requests per IP per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please wait and try again.",
  },
});
app.use("/api", limiter);

// ─── Body Parser ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api", downloadRoutes);

// Root
app.get("/", (req, res) => {
  res.json({
    message: "🎬 Multi Platform Video Downloader API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      videoInfo: "POST /api/video-info",
      downloadUrl: "POST /api/download-url",
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found." });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Global Error]", err.message);
  res.status(500).json({ success: false, error: "Internal server error." });
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Video Downloader API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});
