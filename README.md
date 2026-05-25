# 🎬 VidGrab – Multi Platform Video Downloader

A full-stack web application to download videos from YouTube, Instagram, TikTok, Facebook, and Twitter/X.

## 🗂️ Project Structure

```
video-downloader/
├── frontend/
│   ├── index.html      # Main UI (open this directly in your browser)
│   ├── style.css       # Premium dark-themed styling
│   └── app.js          # Frontend logic & API calls
│
└── backend/
    ├── server.js            # Express server (entry point)
    ├── routes/
    │   └── download.js      # API routes
    ├── utils/
    │   └── ytDlpHelper.js   # yt-dlp wrapper & URL validation
    ├── .env.example         # Environment variable template
    └── package.json         # Node.js dependencies
```

## ✅ Prerequisites

Before running the project, make sure you have:

| Tool | Download | Purpose |
|------|----------|---------|
| **Node.js** (LTS) | [nodejs.org](https://nodejs.org/) | Run the backend server |
| **Python 3** | [python.org](https://python.org/) | Required by yt-dlp |
| **yt-dlp** | `pip install yt-dlp` | Video extraction engine ✅ Already installed |
| **FFmpeg** | [ffmpeg.org](https://ffmpeg.org/) | Audio/video processing |

## 🚀 Getting Started

### Step 1: Start the Backend

```bash
cd backend
npm install
cp .env.example .env
node server.js
```

The API will be running at: `http://localhost:5000`

### Step 2: Open the Frontend

Simply open `frontend/index.html` in your browser — **no build step needed!**

Or serve it with VS Code **Live Server** extension for hot-reload.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/video-info` | Fetch video metadata & formats |
| `POST` | `/api/download-url` | Get direct download URL |

### Example: Fetch Video Info

```bash
curl -X POST http://localhost:5000/api/video-info \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## 🔒 Security Features

- **Helmet.js** – HTTP security headers
- **CORS** – Whitelisted origins only
- **Rate Limiting** – 60 requests per IP per 15 minutes
- **URL Validation** – Only supported platforms accepted
- **Input Sanitization** – Format IDs are sanitized before shell execution

## 📝 Legal Notice

Downloading copyrighted content without permission may violate:
- Platform Terms of Service (YouTube, Instagram, etc.)
- Local copyright laws

This tool is intended for personal, fair-use downloads only. Please respect content creators' rights.

## 🌐 Supported Platforms

- ✅ YouTube & YouTube Shorts
- ✅ Instagram Reels & Posts
- ✅ TikTok
- ✅ Facebook Videos
- ✅ Twitter/X Videos
