const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);
const { getCookiesArgs } = require("./configHelper");
const path = require("path");
const ytDlpPath = path.join(__dirname, "..", "yt-dlp");

// Supported platform domains
const SUPPORTED_DOMAINS = [
  "youtube.com",
  "youtu.be",
  "instagram.com",
  "facebook.com",
  "fb.watch",
  "tiktok.com",
  "twitter.com",
  "x.com",
];

/**
 * Validate that the URL is from a supported platform
 */
function validateUrl(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace("www.", "");
    const isSupported = SUPPORTED_DOMAINS.some((domain) =>
      hostname.includes(domain)
    );
    if (!isSupported) {
      throw new Error(
        `Platform not supported. Supported: ${SUPPORTED_DOMAINS.join(", ")}`
      );
    }
    return true;
  } catch (err) {
    if (err.message && err.message.startsWith("Platform not supported")) throw err;
    throw new Error("Invalid URL format.");
  }
}

/**
 * Detect which platform the URL belongs to
 */
function detectPlatform(url) {
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "YouTube";
  if (u.includes("instagram.com")) return "Instagram";
  if (u.includes("facebook.com") || u.includes("fb.watch")) return "Facebook";
  if (u.includes("tiktok.com")) return "TikTok";
  if (u.includes("twitter.com") || u.includes("x.com")) return "Twitter/X";
  return "Unknown";
}

/**
 * Clean up tracking parameters from URLs to prevent parser errors
 */
function cleanUrl(url) {
  try {
    const parsed = new URL(url);
    // Remove Facebook/Instagram tracking params
    parsed.searchParams.delete('mibextid');
    parsed.searchParams.delete('igshid');
    parsed.searchParams.delete('utm_source');
    parsed.searchParams.delete('utm_medium');
    return parsed.toString();
  } catch(e) {
    return url;
  }
}

/**
 * Fetch video metadata (title, thumbnail, duration, formats) using yt-dlp
 */
async function getVideoInfo(url) {
  validateUrl(url);
  url = cleanUrl(url);

  // yt-dlp -j returns JSON metadata without downloading
  const cookieArgs = getCookiesArgs().join(" ");
  // Support playlists, limit to 20 items
  const cmd = `"${ytDlpPath}" -j --no-warnings --playlist-end 20 ${cookieArgs} "${url}"`;

  try {
    const { stdout, stderr } = await execAsync(cmd, { timeout: 45000 });
    
    const lines = stdout.trim().split("\n").filter(Boolean);
    const results = [];

    for (const line of lines) {
      const info = JSON.parse(line);

      // Extract available video formats (filter useful ones)
      const formats = (info.formats || [])
        .filter((f) => f.vcodec !== "none" || f.acodec !== "none")
        .map((f) => ({
          format_id: f.format_id,
          ext: f.ext,
          quality: f.format_note || f.height ? `${f.height}p` : "audio",
          resolution: f.resolution || "audio only",
          filesize: f.filesize || f.filesize_approx || null,
          hasVideo: f.vcodec !== "none",
          hasAudio: f.acodec !== "none",
          fps: f.fps || null,
        }))
        .filter(
          (f, idx, arr) =>
            // Deduplicate by quality label
            arr.findIndex((x) => x.quality === f.quality && x.hasVideo === f.hasVideo) === idx
        )
        .sort((a, b) => {
          // Sort: video formats descending by resolution, then audio
          const aRes = parseInt(a.quality) || 0;
          const bRes = parseInt(b.quality) || 0;
          return bRes - aRes;
        });

      results.push({
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        durationString: info.duration_string,
        uploader: info.uploader || info.channel || "Unknown",
        platform: detectPlatform(url),
        viewCount: info.view_count,
        url: info.webpage_url || url, // Use specific video url if playlist
        formats: formats,
      });
    }

    return results;
  } catch (err) {
    const msg = err.message || "";
    if (msg.includes("Cannot parse data") || msg.includes("empty media response") || msg.includes("Sign in") || msg.includes("login")) {
      throw new Error("This video is private or requires login. Please click the ⚙️ Settings icon at the top right to add your Browser Cookies!");
    }
    if (msg.includes("JSON")) {
      throw new Error("Could not parse video info. The video may be private or region-locked.");
    }
    
    // Clean up the yt-dlp error string to be more readable
    if (msg.includes("ERROR:")) {
      let cleanMsg = msg.split("ERROR:")[1];
      cleanMsg = cleanMsg.split("; please report")[0].trim();
      throw new Error(`Failed to fetch video: ${cleanMsg}`);
    }
    
    throw new Error(`yt-dlp error: ${msg}`);
  }
}

/**
 * Get a direct download URL for a specific format
 */
async function getDownloadUrl(url, formatId) {
  validateUrl(url);
  url = cleanUrl(url);

  const safeFormatId = formatId.replace(/[^a-zA-Z0-9_+\-]/g, "");
  const cookieArgs = getCookiesArgs().join(" ");
  const cmd = `"${ytDlpPath}" -f "${safeFormatId}+bestaudio/best" --get-url --no-warnings ${cookieArgs} "${url}"`;

  try {
    const { stdout } = await execAsync(cmd, { timeout: 30000 });
    const urls = stdout.trim().split("\n").filter(Boolean);
    return urls;
  } catch (err) {
    throw new Error(`Could not get download URL: ${err.message}`);
  }
}

module.exports = { getVideoInfo, getDownloadUrl, validateUrl, detectPlatform };
