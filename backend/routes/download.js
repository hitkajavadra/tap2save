const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("ffmpeg-static");
const ytDlpPath = path.join(__dirname, "..", "yt-dlp");
const { getVideoInfo, getDownloadUrl } = require("../utils/ytDlpHelper");
const { getCookiesArgs } = require("../utils/configHelper");

// Store SSE connections for progress tracking
const progressClients = {};

// Ensure temp directory exists
const TMP_DIR = path.join(__dirname, "..", "tmp");
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

router.get("/progress/:id", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const { id } = req.params;
  progressClients[id] = res;
  req.on("close", () => {
    delete progressClients[id];
  });
});

router.post("/video-info", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") return res.status(400).json({ success: false, error: "URL is required." });
  if (url.length > 2048) return res.status(400).json({ success: false, error: "URL is too long." });
  try {
    const info = await getVideoInfo(url.trim());
    return res.json({ success: true, data: info });
  } catch (err) {
    console.error("[video-info error]", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post("/download-url", async (req, res) => {
  const { url, formatId } = req.body;
  if (!url || !formatId) return res.status(400).json({ success: false, error: "url and formatId are required." });
  try {
    const downloadUrls = await getDownloadUrl(url.trim(), formatId);
    return res.json({ success: true, urls: downloadUrls });
  } catch (err) {
    console.error("[download-url error]", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.get("/download", (req, res) => {
  const { url, formatId, filename, downloadId, start, end } = req.query;

  if (!url || !formatId) {
    return res.status(400).json({ success: false, error: "url and formatId are required." });
  }

  const safeFormatId = formatId.replace(/[^a-zA-Z0-9_+\-/]/g, "");
  const safeFilename = (filename || "video").replace(/[^a-z0-9_\-. ]/gi, "_").substring(0, 200);

  const isAudio = safeFormatId.includes("bestaudio") || safeFormatId === "mp3";
  const ext = isAudio ? "mp3" : "mp4";
  const downloadName = safeFilename.endsWith("." + ext) ? safeFilename : `${safeFilename}.${ext}`;

  console.log(`[download] Starting: format=${safeFormatId} file="${downloadName}" trimmer=${start}-${end}`);
  const baseArgs = getCookiesArgs();
  
  if (start && end) {
    baseArgs.push("--download-sections", `*${start}-${end}`);
  }

  function emitProgress(dataStr) {
    if (!downloadId || !progressClients[downloadId]) return;
    const progressMatch = dataStr.match(/([0-9.]+)%/);
    if (progressMatch) {
      progressClients[downloadId].write(`data: ${JSON.stringify({ progress: parseFloat(progressMatch[1]), status: "Downloading" })}\n\n`);
    } else if (dataStr.includes("Merging formats into")) {
      progressClients[downloadId].write(`data: ${JSON.stringify({ status: "Merging formats..." })}\n\n`);
    }
  }

  // If audio, we can usually stream stdout directly
  if (isAudio) {
    const args = [...baseArgs, "--ffmpeg-location", ffmpegPath, "-f", safeFormatId, "--extract-audio", "--audio-format", "mp3", "--embed-thumbnail", "--add-metadata", "-o", "-", url];
    res.setHeader("Content-Disposition", `attachment; filename="${downloadName}"`);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");
    const ytDlp = spawn(ytDlpPath, args);
    ytDlp.stdout.pipe(res);
    ytDlp.stderr.on("data", (data) => {
      const out = data.toString();
      emitProgress(out);
    });
    ytDlp.on("error", (err) => {
      if (!res.headersSent) res.status(500).json({ success: false, error: err.message });
    });
    ytDlp.on("close", () => { 
      if (downloadId && progressClients[downloadId]) {
        progressClients[downloadId].write(`data: ${JSON.stringify({ done: true })}\n\n`);
      }
      if (!res.writableEnded) res.end(); 
    });
    req.on("close", () => ytDlp.kill("SIGTERM"));
    return;
  }

  // FOR VIDEO: yt-dlp CANNOT merge audio and video if streaming to stdout (-o -).
  // So we MUST download to a temp file, wait for it to merge, and then send the file.
  const uniqueId = `${Date.now()}_id_${safeFormatId}`;
  const tempFileName = `temp_${uniqueId}.mp4`;
  const tempFilePath = path.join(TMP_DIR, tempFileName);

  const args = [...baseArgs, "--ffmpeg-location", ffmpegPath, "-f", `${safeFormatId}+bestaudio/best`, "--merge-output-format", "mp4", "-o", path.join(TMP_DIR, `temp_${uniqueId}.%(ext)s`), url];
  
  const ytDlp = spawn(ytDlpPath, args);

  ytDlp.stderr.on("data", (data) => {
    emitProgress(data.toString());
  });

  ytDlp.on("error", (err) => {
    console.error("[yt-dlp error]", err);
    if (!res.headersSent) res.status(500).json({ success: false, error: "Download failed" });
  });

  ytDlp.on("close", (code) => {
    // Find the actual file created by yt-dlp
    let actualFile = null;
    if (fs.existsSync(TMP_DIR)) {
      const files = fs.readdirSync(TMP_DIR);
      actualFile = files.find(f => f.startsWith(`temp_${uniqueId}.`));
    }

    if (code === 0 && actualFile) {
      const actualFilePath = path.join(TMP_DIR, actualFile);
      if (downloadId && progressClients[downloadId]) {
        progressClients[downloadId].write(`data: ${JSON.stringify({ done: true })}\n\n`);
      }
      
      // Update download name extension if yt-dlp changed it
      const ext = path.extname(actualFile);
      const finalDownloadName = downloadName.replace(/\.[^/.]+$/, "") + ext;

      console.log(`[download] Merge complete. Sending ${finalDownloadName} to client.`);
      res.download(actualFilePath, finalDownloadName, (err) => {
        // Cleanup temp file after sending
        if (fs.existsSync(actualFilePath)) {
          try { fs.unlinkSync(actualFilePath); } catch (e) { console.error("Cleanup error:", e); }
        }
      });
    } else {
      console.error(`[download] yt-dlp failed to create merged video. Exit code: ${code}, File exists: ${!!actualFile}`);
      if (!res.headersSent) res.status(500).send(`Error generating video with audio. Code: ${code}`);
    }
  });

  req.on("close", () => {
    ytDlp.kill("SIGTERM");
    // Wait a bit then cleanup if it was aborted
    setTimeout(() => {
      if (fs.existsSync(tempFilePath)) {
        try { fs.unlinkSync(tempFilePath); } catch (e) {}
      }
    }, 5000);
  });
});

router.post("/settings/cookies", (req, res) => {
  const { cookies } = req.body;
  const { COOKIES_PATH } = require("../utils/configHelper");
  try {
    if (typeof cookies === "string" && cookies.trim().length > 0) {
      fs.writeFileSync(COOKIES_PATH, cookies.trim(), "utf8");
      res.json({ success: true, message: "Cookies saved successfully." });
    } else {
      if (fs.existsSync(COOKIES_PATH)) fs.unlinkSync(COOKIES_PATH);
      res.json({ success: true, message: "Cookies cleared." });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/health", (req, res) => {
  res.json({ success: true, status: "Server is running", timestamp: new Date().toISOString() });
});

router.get("/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send("URL required");
  
  try {
    const proxyRes = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/*,*/*;q=0.8"
      },
      redirect: "follow"
    });
    
    if (!proxyRes.ok) {
      return res.status(proxyRes.status).send("Failed to fetch image from CDN");
    }
    
    res.set("Content-Type", proxyRes.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.set("Access-Control-Allow-Origin", "*");
    
    const arrayBuffer = await proxyRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
    
  } catch (err) {
    console.error("[proxy-image error]", err.message);
    if (!res.headersSent) res.status(500).send("Error proxying image");
  }
});

module.exports = router;
