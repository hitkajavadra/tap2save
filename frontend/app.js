// ============================================================
// Tap2save – Frontend Application Logic
// ============================================================
// Configuration
const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? "http://localhost:5000/api" : "https://tap2save.onrender.com/api";

function getProxyImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:") || url.includes("/proxy-image")) return url;
  return API_BASE + "/proxy-image?url=" + encodeURIComponent(url);
}

// ──────────────────────────────────────────────────────
// Platform Configuration
// ──────────────────────────────────────────────────────

const PLATFORM_CONFIG = {
  youtube: {
    label: "YouTube",
    icon: `<svg width="24" height="24" viewBox="0 0 28 28" fill="none" style="vertical-align:middle;margin-right:6px"><rect width="28" height="28" rx="7" fill="#FF0000"/><path d="M22.5 9.7C22.3 8.9 21.7 8.3 20.9 8.1C19.5 7.7 14 7.7 14 7.7C14 7.7 8.5 7.7 7.1 8.1C6.3 8.3 5.7 8.9 5.5 9.7C5.1 11.1 5.1 14 5.1 14C5.1 14 5.1 16.9 5.5 18.3C5.7 19.1 6.3 19.7 7.1 19.9C8.5 20.3 14 20.3 14 20.3C14 20.3 19.5 20.3 20.9 19.9C21.7 19.7 22.3 19.1 22.5 18.3C22.9 16.9 22.9 14 22.9 14C22.9 14 22.9 11.1 22.5 9.7Z" fill="white"/><path d="M12 17L17.2 14L12 11V17Z" fill="#FF0000"/></svg>`,
    gradientWord: "YouTube",
    heroSub: "Paste a YouTube link — download Videos, Shorts, Playlists & Live streams in HD.",
    placeholder: "Paste YouTube URL... (e.g. https://youtube.com/watch?v=...)",
    contentTypes: ["Video", "Short", "Playlist", "Live"],
  },
  instagram: {
    label: "Instagram",
    icon: `<svg width="24" height="24" viewBox="0 0 28 28" fill="none" style="vertical-align:middle;margin-right:6px"><defs><radialGradient id="ig-grad-app" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><rect width="28" height="28" rx="7" fill="url(#ig-grad-app)"/><rect x="7" y="7" width="14" height="14" rx="4" stroke="white" stroke-width="1.8" fill="none"/><circle cx="14" cy="14" r="3.5" stroke="white" stroke-width="1.8" fill="none"/><circle cx="19" cy="9" r="1.1" fill="white"/></svg>`,
    gradientWord: "Instagram",
    heroSub: "Download Instagram Reels, Posts, Stories & IGTV videos in high quality.",
    placeholder: "Paste Instagram URL... (e.g. https://instagram.com/reel/...)",
    contentTypes: ["Reel", "Post", "Story", "IGTV"],
  },
  tiktok: {
    label: "TikTok",
    icon: `<svg width="24" height="24" viewBox="0 0 28 28" fill="none" style="vertical-align:middle;margin-right:6px"><rect width="28" height="28" rx="7" fill="#010101"/><path d="M19.5 7C19.5 7 19.8 9.8 22.5 10.5V13.3C22.5 13.3 20.5 13.2 19 12.1V18C19 20.8 16.8 23 14 23C11.2 23 9 20.8 9 18C9 15.2 11.2 13 14 13C14.3 13 14.5 13 14.8 13.1V16C14.5 15.9 14.3 15.9 14 15.9C12.8 15.9 11.9 16.9 11.9 18C11.9 19.2 12.8 20.1 14 20.1C15.2 20.1 16.1 19.2 16.1 18V5H19.5V7Z" fill="white"/><path d="M19.5 7C19.5 7 19.8 9.8 22.5 10.5" stroke="#69C9D0" stroke-width="0.8" fill="none"/><path d="M14.8 13.1V16C14.5 15.9 14.3 15.9 14 15.9" stroke="#EE1D52" stroke-width="0.8" fill="none"/></svg>`,
    gradientWord: "TikTok",
    heroSub: "Save TikTok Videos, Duets & Stories directly to your device — no watermark.",
    placeholder: "Paste TikTok URL... (e.g. https://tiktok.com/@user/video/...)",
    contentTypes: ["Video", "Duet", "Story"],
  },
  facebook: {
    label: "Facebook",
    icon: `<svg width="24" height="24" viewBox="0 0 28 28" fill="none" style="vertical-align:middle;margin-right:6px"><rect width="28" height="28" rx="7" fill="#1877F2"/><path d="M15.6 22V15.2H17.8L18.1 12.6H15.6V11C15.6 10.2 15.8 9.7 16.9 9.7H18.2V7.3C17.5 7.2 16.8 7.2 16.1 7.2C14.1 7.2 12.7 8.4 12.7 10.7V12.6H10.5V15.2H12.7V22H15.6Z" fill="white"/></svg>`,
    gradientWord: "Facebook",
    heroSub: "Download Facebook Videos, Reels, Watch content & Stories in HD quality.",
    placeholder: "Paste Facebook URL... (e.g. https://facebook.com/watch?v=...)",
    contentTypes: ["Video", "Reel", "Watch", "Story"],
  },
  twitter: {
    label: "Twitter/X",
    icon: `<svg width="24" height="24" viewBox="0 0 28 28" fill="none" style="vertical-align:middle;margin-right:6px"><rect width="28" height="28" rx="7" fill="#000000"/><path d="M6 6.5L12.5 15.2L6 22H7.5L13.2 16.1L17.8 22H22.5L15.7 12.8L21.8 6.5H20.3L15 11.9L10.7 6.5H6ZM8.2 7.6H10.2L20.3 20.9H18.3L8.2 7.6Z" fill="white"/></svg>`,
    gradientWord: "Twitter / X",
    heroSub: "Download Twitter/X Videos, GIFs & Thread media in the best available quality.",
    placeholder: "Paste Twitter/X URL... (e.g. https://twitter.com/user/status/...)",
    contentTypes: ["Video", "GIF", "Thread"],
  },
  snapchat: {
    label: "Snapchat",
    icon: `<svg width="24" height="24" viewBox="0 0 28 28" fill="none" style="vertical-align:middle;margin-right:6px"><defs><radialGradient id="snap-3d" cx="75%" cy="25%" r="75%"><stop offset="0%" stop-color="#ffffff"/><stop offset="10%" stop-color="#fffa55"/><stop offset="50%" stop-color="#ffe600"/><stop offset="100%" stop-color="#dca500"/></radialGradient></defs><circle cx="14" cy="14" r="14" fill="url(#snap-3d)"/><svg x="4" y="4" width="20" height="20" viewBox="-1.5 -1.5 27 27"><path fill="#fdfae8" stroke="#4a3e00" stroke-width="1.2" stroke-linejoin="round" d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></svg></svg>`,
    gradientWord: "Snapchat",
    heroSub: "Save Snapchat Snaps, Stories & Spotlight videos instantly.",
    placeholder: "Paste Snapchat URL... (e.g. https://snapchat.com/spotlight/...)",
    contentTypes: ["Snap", "Story", "Spotlight"],
  },
};

// ──────────────────────────────────────────────────────
// DOM Elements
// ──────────────────────────────────────────────────────

const urlInput      = document.getElementById("urlInput");
const fetchBtn      = document.getElementById("fetchBtn");
const btnIcon       = document.getElementById("btnIcon");
const btnText       = document.getElementById("btnText");
const loader        = document.getElementById("loader");
const errorBox      = document.getElementById("errorBox");
const errorMsg      = document.getElementById("errorMsg");
const resultCard    = document.getElementById("resultCard");
const toast         = document.getElementById("toast");
const toastMsg      = document.getElementById("toastMsg");
const toastIcon     = document.getElementById("toastIcon");
const dlOverlay     = document.getElementById("dlOverlay");
const contentTypeRow= document.getElementById("contentTypeRow");
const platformLabel = document.getElementById("platformLabel");
const heroSub       = document.getElementById("heroSub");
const headerBadge   = document.getElementById("headerBadge");

// Result Elements
const thumbnail     = document.getElementById("thumbnail");
const videoTitle    = document.getElementById("videoTitle");
const platformBadge = document.getElementById("platformBadge");
const durationStat  = document.getElementById("durationStat");
const uploaderStat  = document.getElementById("uploaderStat");
const viewsStat     = document.getElementById("viewsStat");
const formatsGrid   = document.getElementById("formatsGrid");
const mp3Btn        = document.getElementById("mp3Btn");

// Quality Modal Elements
const qualityModal      = document.getElementById("qualityModal");
const modalClose        = document.getElementById("modalClose");
const qualityOptionsGrid= document.getElementById("qualityOptionsGrid");
const modalThumb        = document.getElementById("modalThumb");
const modalVideoTitle   = document.getElementById("modalVideoTitle");
const modalMp3Btn       = document.getElementById("modalMp3Btn");

// Extra Feature Elements
const urlClearBtn   = document.getElementById("urlClearBtn");
const pasteGoBtn    = document.getElementById("pasteGoBtn");
const copyUrlBtn    = document.getElementById("copyUrlBtn");
const dlCountBadge  = document.getElementById("dlCountBadge");
const historyPanel  = document.getElementById("historyPanel");
const historyList   = document.getElementById("historyList");
const historyCount  = document.getElementById("historyCount");
const historyClearBtn = document.getElementById("historyClearBtn");

// State
let currentEventSource = {
  onerror: () => {
    currentEventSource.close();
  },
  close: () => {}
};

// ------------------------------------------------------
// 4. Playlist Selector Logic
// ------------------------------------------------------
function renderPlaylistSelector(dataArr) {
  // Remove existing playlist container if any
  const existing = document.getElementById("playlistContainer");
  if (existing) existing.remove();
  
  if (dataArr.length <= 1) return;
  
  const container = document.createElement("div");
  container.id = "playlistContainer";
  container.className = "playlist-container";
  container.innerHTML = `<h3 style="margin-top:20px;font-size:0.9rem;color:var(--text-secondary);">📑 Playlist Videos (${dataArr.length})</h3><div class="playlist-grid" style="display:flex;gap:10px;overflow-x:auto;padding:10px 0;"></div>`;
  
  const grid = container.querySelector(".playlist-grid");
  
  dataArr.forEach((item, index) => {
    const card = document.createElement("div");
    card.style.cssText = "min-width:120px; cursor:pointer; border-radius:8px; overflow:hidden; background:var(--bg-secondary); border:1px solid var(--border);";
    card.innerHTML = `
      <img src="${getProxyImageUrl(item.thumbnail)}" style="width:100%; height:70px; object-fit:cover;" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://placehold.co/300x200/1a1a2e/ffffff?text=Preview';" />
      <div style="padding:6px; font-size:0.7rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.title}</div>
    `;
    card.onclick = () => {
      currentVideoInfo = item;
      currentVideoUrl = item.url;
      renderResult(item);
      window.scrollTo({ top: document.getElementById("resultCard").offsetTop - 100, behavior: "smooth" });
    };
    grid.appendChild(card);
  });
  
  // Insert after result card
  const resultCard = document.getElementById("resultCard");
  resultCard.parentNode.insertBefore(container, resultCard.nextSibling);
}

let selectedPlatform = null;
let selectedType     = null;
let currentVideoInfo = null; // Store full video info for history
let sessionDownloads = 0;

// ──────────────────────────────────────────────────────
// Platform Selection & Theming
// ──────────────────────────────────────────────────────

function selectPlatform(platformId) {
  selectedPlatform = platformId;
  selectedType = null;

  const cfg = PLATFORM_CONFIG[platformId];
  if (!cfg) return;

  // Update body theme
  document.body.setAttribute("data-platform", platformId);

  // Update toolbar active state
  document.querySelectorAll(".platform-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.id === platformId);
    btn.setAttribute("aria-selected", btn.dataset.id === platformId);
  });

  // Update hero text
  platformLabel.textContent = cfg.gradientWord;
  heroSub.textContent = cfg.heroSub;
  urlInput.placeholder = cfg.placeholder;
  headerBadge.innerHTML = `${cfg.icon} ${cfg.label}`;

  // Render content types
  renderContentTypes(platformId);

  // Reset result
  showResult(false);
  hideError();
  renderHistory();
}

function renderContentTypes(platformId) {
  const cfg = PLATFORM_CONFIG[platformId];
  if (!cfg || !cfg.contentTypes.length) {
    contentTypeRow.classList.add("hidden");
    return;
  }

  contentTypeRow.innerHTML = "";
  contentTypeRow.classList.remove("hidden");

  // Label
  const label = document.createElement("span");
  label.className = "content-type-label";
  label.textContent = "Type:";
  contentTypeRow.appendChild(label);

  // Buttons
  cfg.contentTypes.forEach((type, i) => {
    const btn = document.createElement("button");
    btn.className = "ctype-btn";
    btn.textContent = type;
    btn.style.animationDelay = `${i * 0.05}s`;
    btn.setAttribute("aria-label", `${type} content type`);
    btn.addEventListener("click", () => selectContentType(type, btn));
    contentTypeRow.appendChild(btn);
  });
}

function selectContentType(type, btnEl) {
  selectedType = type;
  document.querySelectorAll(".ctype-btn").forEach(b => b.classList.remove("active"));
  btnEl.classList.add("active");
  // Update placeholder to reflect selection
  const cfg = PLATFORM_CONFIG[selectedPlatform];
  if (cfg) {
    urlInput.placeholder = `Paste ${cfg.label} ${type} URL...`;
  }
}

// ──────────────────────────────────────────────────────
// Quality Modal
// ──────────────────────────────────────────────────────

function openQualityModal(formats, thumbSrc, title) {
  currentFormats = formats;

  // Set modal video info
  modalThumb.src = getProxyImageUrl(thumbSrc) || "";
  modalVideoTitle.textContent = title || "Untitled Video";

  // Build quality option buttons
  qualityOptionsGrid.innerHTML = "";

  const videoFormats = formats.filter(f => f.hasVideo);

  if (videoFormats.length === 0) {
    qualityOptionsGrid.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;grid-column:1/-1;">No video formats available.</p>`;
  } else {
    videoFormats.slice(0, 12).forEach(fmt => {
      const btn = document.createElement("button");
      btn.className = "quality-option-btn";
      btn.setAttribute("aria-label", `Download ${fmt.quality} ${fmt.ext}`);

      // Badge
      const qualityNum = parseInt(fmt.quality);
      let badge = "";
      if (qualityNum >= 2160) badge = `<span class="qopt-badge uhd">4K</span>`;
      else if (qualityNum >= 1080) badge = `<span class="qopt-badge hd">HD</span>`;

      const sizeStr = formatFilesize(fmt.filesize);
      btn.innerHTML = `
        ${badge}
        <span class="qopt-quality">${fmt.quality || "Unknown"}</span>
        <span class="qopt-detail">${fmt.ext?.toUpperCase() || "MP4"} · ${fmt.fps ? fmt.fps + "fps" : ""}</span>
        ${sizeStr ? `<span class="qopt-size">${sizeStr}</span>` : ""}
      `;
      btn.addEventListener("click", () => {
        closeQualityModal();
        triggerDownload(fmt.format_id, fmt.quality);
      });
      qualityOptionsGrid.appendChild(btn);
    });
  }

  // Show modal
  qualityModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeQualityModal() {
  qualityModal.classList.remove("show");
  document.body.style.overflow = "";
}

// Close modal on overlay click
qualityModal.addEventListener("click", (e) => {
  if (e.target === qualityModal) closeQualityModal();
});
modalClose.addEventListener("click", closeQualityModal);

// Modal MP3 button
modalMp3Btn.addEventListener("click", () => {
  closeQualityModal();
  triggerMp3Download();
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && qualityModal.classList.contains("show")) {
    closeQualityModal();
  }
});

// ──────────────────────────────────────────────────────
// Utility Functions
// ──────────────────────────────────────────────────────

function showLoader(show) {
  loader.classList.toggle("visible", show);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.classList.add("visible");
}

function hideError() {
  errorBox.classList.remove("visible");
}

function showResult(show) {
  resultCard.classList.toggle("visible", show);
}

function setLoading(loading) {
  fetchBtn.disabled = loading;
  if (loading) {
    btnIcon.textContent = "⏳";
    btnText.textContent = "Fetching...";
  } else {
    btnIcon.textContent = "⬇️";
    btnText.textContent = "Get Video";
  }
}

function formatDuration(seconds) {
  if (!seconds) return "--:--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${m}:${String(s).padStart(2,"0")}`;
}

function formatViews(count) {
  if (!count) return "--";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
}

function formatFilesize(bytes) {
  if (!bytes) return "";
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

// ──────────────────────────────────────────────────────
// Toast Notification
// ──────────────────────────────────────────────────────

let toastTimer;
function showToast(msg, type = "success") {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  toastIcon.textContent = type === "success" ? "✅" : "⚠️";
  toast.className = `toast show ${type}`;
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

// ──────────────────────────────────────────────────────
// Main: Fetch Video Info
// ──────────────────────────────────────────────────────

async function fetchVideoInfo() {
  const url = urlInput.value.trim();

  if (!url) {
    showError("Please paste a video URL first.");
    return;
  }

  try {
    new URL(url);
  } catch {
    showError("That doesn't look like a valid URL. Please check and try again.");
    return;
  }

  hideError();
  showResult(false);
  showLoader(true);
  setLoading(true);
  currentVideoUrl = url;

  // Auto-detect platform from URL if none selected
  if (!selectedPlatform) {
    const detected = detectPlatformFromUrl(url);
    if (detected) selectPlatform(detected);
  }

  try {
    const res = await fetch(`${API_BASE}/video-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const result = await res.json();

    if (result.success) {
      const dataArr = Array.isArray(result.data) ? result.data : [result.data];
      
      if (dataArr.length === 0) {
        showError("No valid videos found in playlist.");
        return;
      }

      currentVideoInfo = dataArr[0];
      currentVideoUrl = currentVideoInfo.url;
      renderResult(currentVideoInfo);
      
      // Render playlist selector if multiple videos
      if (typeof renderPlaylistSelector === "function") {
        renderPlaylistSelector(dataArr);
      }
    } else {
      throw new Error(result.error || "Could not fetch video information.");
    }

    showToast("Video info loaded!", "success");

  } catch (err) {
    if (err.name === "TypeError") {
      showError("⚡ Backend server is not running. Start it with: cd backend && npm install && npm start");
    } else {
      showError(err.message);
    }
  } finally {
    showLoader(false);
    setLoading(false);
  }
}

// Auto-detect platform from URL
function detectPlatformFromUrl(url) {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be"))  return "youtube";
  if (lower.includes("instagram.com"))                               return "instagram";
  if (lower.includes("tiktok.com"))                                  return "tiktok";
  if (lower.includes("facebook.com") || lower.includes("fb.watch")) return "facebook";
  if (lower.includes("twitter.com") || lower.includes("x.com"))     return "twitter";
  if (lower.includes("snapchat.com"))                               return "snapchat";
  return null;
}

// ──────────────────────────────────────────────────────
// Render Video Result
// ──────────────────────────────────────────────────────

function renderResult(info) {
  currentVideoInfo = info; // Save for history tracking
  // Thumbnail
  if (info.thumbnail) {
    thumbnail.src = getProxyImageUrl(info.thumbnail);
    thumbnail.alt = info.title || "Video thumbnail";
  }

  // Title & metadata
  videoTitle.textContent = info.title || "Untitled Video";
  platformBadge.textContent = info.platform || selectedPlatform || "Video";
  durationStat.textContent = `⏱ ${formatDuration(info.duration)}`;
  uploaderStat.textContent = `👤 ${info.uploader || "Unknown"}`;
  viewsStat.textContent = `👁 ${formatViews(info.viewCount)}`;

  // Store formats for modal
  currentFormats = info.formats || [];
  const videoFormats = currentFormats.filter(f => f.hasVideo);

  // Build format grid (clicking opens quality modal)
  formatsGrid.innerHTML = "";

  if (videoFormats.length === 0) {
    formatsGrid.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;grid-column:1/-1;">No video formats found for this URL.</p>`;
  } else {
    videoFormats.slice(0, 12).forEach(fmt => {
      const btn = document.createElement("button");
      btn.className = "format-btn";
      btn.setAttribute("aria-label", `Download ${fmt.quality} ${fmt.ext}`);
      btn.innerHTML = `
        <span class="format-quality">${fmt.quality || "Unknown"}</span>
        <span class="format-details">${fmt.ext?.toUpperCase() || "MP4"} ${formatFilesize(fmt.filesize)}</span>
        <span class="format-type-badge badge-video">VIDEO</span>
      `;
      // Click opens quality modal
      btn.addEventListener("click", () => {
        openQualityModal(videoFormats, info.thumbnail, info.title);
      });
      formatsGrid.appendChild(btn);
    });
  }

  // MP3 button
  mp3Btn.onclick = () => triggerMp3Download();

  showResult(true);
  setTimeout(() => resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
}

// ──────────────────────────────────────────────────────
// Download Handlers
// ──────────────────────────────────────────────────────

function triggerDownload(formatId, qualityLabel) {
  // Use the backend streaming endpoint — avoids CORS/auth issues with CDN URLs
  const isAudio = formatId === "bestaudio/best" || formatId === "mp3";

  // Build a safe filename from current video title
  const rawTitle = document.getElementById("videoTitle").textContent || "video";
  const safeTitle = rawTitle.replace(/[^a-z0-9 ]/gi, "_").substring(0, 80);
  const filename = isAudio ? `${safeTitle}.mp3` : `${safeTitle}_${qualityLabel}.mp4`;

  // Get trimmer values
  const trimStart = document.getElementById("trimStart")?.value?.trim();
  const trimEnd = document.getElementById("trimEnd")?.value?.trim();

  // Generate a random ID for progress tracking
  const downloadId = Date.now().toString();

  // Build download URL pointing to our streaming backend endpoint
  const params = new URLSearchParams({
    url: currentVideoUrl,
    formatId: formatId,
    filename: filename,
    downloadId: downloadId
  });
  
  if (trimStart) params.append("start", trimStart);
  if (trimEnd) params.append("end", trimEnd);

  const downloadEndpoint = `${API_BASE}/download?${params.toString()}`;

  // Create a hidden <a> tag and click it — browser will show native download dialog
  const a = document.createElement("a");
  a.href = downloadEndpoint;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast(`⬇️ Downloading ${qualityLabel}... (check your browser downloads)`, "success");
  
  // Start SSE listener and show overlay
  dlOverlay.classList.add("show");
  if (typeof listenToProgress === "function") {
    listenToProgress(downloadId);
  } else {
    setTimeout(() => dlOverlay.classList.remove("show"), 5000);
  }

  showViralPrompt();
  // Track in history & increment counter
  if (currentVideoInfo) addToHistory(currentVideoInfo, qualityLabel, formatId);
  incrementDownloadCount();
}

function triggerMp3Download() {
  triggerDownload("bestaudio/best", "MP3 Audio");
}

// ──────────────────────────────────────────────────────
// Download History (localStorage)
// ──────────────────────────────────────────────────────

const HISTORY_KEY = "Tap2save_history";
const MAX_HISTORY = 20;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

function saveHistory(items) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
}

function addToHistory(videoInfo, qualityLabel, formatId) {
  const items = loadHistory();
  const entry = {
    id: Date.now(),
    title: videoInfo.title || "Untitled",
    thumbnail: videoInfo.thumbnail || "",
    platform: videoInfo.platform || selectedPlatform || "Video",
    url: currentVideoUrl,
    quality: qualityLabel,
    formatId: formatId,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
  items.unshift(entry);
  saveHistory(items);
  renderHistory();
}

function renderHistory() {
  const allItems = loadHistory();
  const items = selectedPlatform 
    ? allItems.filter(item => item.platform && item.platform.toLowerCase() === selectedPlatform.toLowerCase())
    : allItems;

  historyCount.textContent = `${items.length} item${items.length !== 1 ? "s" : ""}`;

  if (items.length === 0) {
    historyList.innerHTML = `<p class="history-empty">No downloads yet for this platform.</p>`;
    historyPanel.classList.remove("visible");
    return;
  }

  historyPanel.classList.add("visible");
  historyList.innerHTML = "";

  items.forEach(item => {
    const el = document.createElement("div");
    el.className = "history-item";
    el.innerHTML = `
      <img class="history-thumb" src="${getProxyImageUrl(item.thumbnail)}" alt="" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://placehold.co/300x200/1a1a2e/ffffff?text=Preview';" />
      <div class="history-info">
        <div class="history-item-title">${item.title}</div>
        <div class="history-item-meta">
          <span>${item.platform}</span>
          <span class="history-quality-tag">${item.quality}</span>
          <span>${item.time}</span>
        </div>
      </div>
      <button class="history-redownload-btn" data-url="${encodeURIComponent(item.url)}" data-fmt="${item.formatId}" data-ql="${item.quality}">
        ⬇ Again
      </button>
    `;
    el.querySelector(".history-redownload-btn").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      currentVideoUrl = decodeURIComponent(btn.dataset.url);
      triggerDownload(btn.dataset.fmt, btn.dataset.ql);
    });
    historyList.appendChild(el);
  });
}

historyClearBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
  showToast("History cleared", "success");
});

// ──────────────────────────────────────────────────────
// Session Download Counter
// ──────────────────────────────────────────────────────

function incrementDownloadCount() {
  sessionDownloads++;
  dlCountBadge.textContent = sessionDownloads;
  dlCountBadge.classList.add("bump");
  setTimeout(() => dlCountBadge.classList.remove("bump"), 300);
}

// ──────────────────────────────────────────────────────
// Event Listeners
// ──────────────────────────────────────────────────────

fetchBtn.addEventListener("click", fetchVideoInfo);

urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchVideoInfo();
});

// Clear button
urlInput.addEventListener("input", () => {
  hideError();
  urlClearBtn.classList.toggle("visible", urlInput.value.length > 0);
  const detected = detectPlatformFromUrl(urlInput.value);
  if (detected && detected !== selectedPlatform) selectPlatform(detected);
});

urlClearBtn.addEventListener("click", () => {
  urlInput.value = "";
  urlClearBtn.classList.remove("visible");
  urlInput.focus();
  hideError();
  showResult(false);
});

// Paste & Go button
pasteGoBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text && (text.startsWith("http://") || text.startsWith("https://"))) {
      urlInput.value = text;
      urlClearBtn.classList.add("visible");
      const detected = detectPlatformFromUrl(text);
      if (detected) selectPlatform(detected);
      fetchVideoInfo();
    } else {
      showToast("No URL found in clipboard", "error");
    }
  } catch {
    showToast("Clipboard access denied — paste manually", "error");
  }
});

// Copy URL button on result card
copyUrlBtn.addEventListener("click", async () => {
  if (!currentVideoUrl) return;
  try {
    await navigator.clipboard.writeText(currentVideoUrl);
    copyUrlBtn.textContent = "✓ Copied!";
    copyUrlBtn.classList.add("copied");
    setTimeout(() => {
      copyUrlBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Link`;
      copyUrlBtn.classList.remove("copied");
    }, 2000);
  } catch {
    showToast("Could not copy to clipboard", "error");
  }
});

// Platform toolbar click
document.querySelectorAll(".platform-btn").forEach(btn => {
  btn.addEventListener("click", () => selectPlatform(btn.dataset.id));
});

// Auto-paste on focus if clipboard has a URL
urlInput.addEventListener("focus", async () => {
  if (urlInput.value) return;
  try {
    const text = await navigator.clipboard.readText();
    if (text && (text.startsWith("http://") || text.startsWith("https://"))) {
      urlInput.value = text;
      urlInput.select();
      urlClearBtn.classList.add("visible");
      const detected = detectPlatformFromUrl(text);
      if (detected && !selectedPlatform) selectPlatform(detected);
    }
  } catch {
    // Clipboard access denied
  }
});

// Ctrl+Enter = fetch
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") fetchVideoInfo();
});

// Init: load history on page load
renderHistory();


// ------------------------------------------------------
// Settings / Cookies Modal
// ------------------------------------------------------

const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const settingsClose = document.getElementById("settingsClose");
const cookiesInput = document.getElementById("cookiesInput");
const clearCookiesBtn = document.getElementById("clearCookiesBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");

settingsBtn.addEventListener("click", () => {
  settingsModal.classList.add("show");
  // Optionally, we could fetch existing cookies from backend to populate this
});

settingsClose.addEventListener("click", () => {
  settingsModal.classList.remove("show");
});

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove("show");
  }
});

saveSettingsBtn.addEventListener("click", async () => {
  const val = cookiesInput.value;
  try {
    const res = await fetch(`${API_BASE}/settings/cookies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cookies: val }),
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, "success");
      settingsModal.classList.remove("show");
    } else {
      showToast(data.error || "Failed to save cookies", "error");
    }
  } catch (err) {
    showToast(err.message, "error");
  }
});

clearCookiesBtn.addEventListener("click", async () => {
  cookiesInput.value = "";
  try {
    const res = await fetch(`${API_BASE}/settings/cookies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cookies: "" }),
    });
    const data = await res.json();
    if (data.success) {
      showToast("Cookies cleared from server", "success");
      settingsModal.classList.remove("show");
    }
  } catch (err) {
    showToast(err.message, "error");
  }
});

// ------------------------------------------------------
// Extra Features: Share & Download Thumbnail
// ------------------------------------------------------

const shareBtn = document.getElementById("shareBtn");
const dlThumbBtn = document.getElementById("dlThumbBtn");

shareBtn.addEventListener("click", async () => {
  if (!currentVideoInfo) return;
  const shareData = {
    title: currentVideoInfo.title,
    text: "Check out this video I found!",
    url: currentVideoInfo.url
  };
  
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast("Shared successfully", "success");
    } catch (err) {
      if (err.name !== "AbortError") {
        showToast("Error sharing", "error");
      }
    }
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(currentVideoInfo.url);
    shareBtn.innerHTML = "Copied!";
    setTimeout(() => {
      shareBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Share`;
    }, 2000);
    showToast("Link copied to clipboard", "success");
  }
});

dlThumbBtn.addEventListener("click", async () => {
  if (!currentVideoInfo || !currentVideoInfo.thumbnail) return;
  
  try {
    showToast("Downloading thumbnail...", "success");
    const proxyUrl = getProxyImageUrl(currentVideoInfo.thumbnail);
    const res = await fetch(proxyUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    
    // Show viral prompt after a small delay
    showViralPrompt();
    
    // create a safe filename
    let safeTitle = currentVideoInfo.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    a.download = safeTitle + "_thumbnail.jpg";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    // If CORS fails, fallback to opening in new tab
    const proxyUrl = getProxyImageUrl(currentVideoInfo.thumbnail);
    window.open(proxyUrl, "_blank");
  }
});

// ------------------------------------------------------
// Viral Growth: PWA Service Worker & Share Prompt
// ------------------------------------------------------

// Register Service Worker for PWA (Installable App)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}

const viralShareModal = document.getElementById("viralShareModal");
const viralShareClose = document.getElementById("viralShareClose");
const btnNotNow = document.getElementById("btnNotNow");
const btnShareApp = document.getElementById("btnShareApp");

function showViralPrompt() {
  // Show it only once per session or use localStorage to show every few downloads
  let dlCount = parseInt(localStorage.getItem('Tap2save_dl_count') || '0');
  dlCount++;
  localStorage.setItem('Tap2save_dl_count', dlCount);
  
  if (dlCount === 1 || dlCount % 3 === 0) {
    setTimeout(() => {
      viralShareModal.classList.add("show");
    }, 1500); // show 1.5 seconds after download finishes
  }
}

function hideViralPrompt() {
  viralShareModal.classList.remove("show");
}

viralShareClose?.addEventListener("click", hideViralPrompt);
btnNotNow?.addEventListener("click", hideViralPrompt);

btnShareApp?.addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Tap2save - Ultimate Video Downloader",
        text: "I use Tap2save to download HD videos from YouTube, Instagram, and TikTok for free! Check it out:",
        url: window.location.origin
      });
      hideViralPrompt();
      showToast("Thanks for sharing! ??", "success");
    } catch (e) {
      console.log(e);
    }
  } else {
    navigator.clipboard.writeText(window.location.origin);
    showToast("Link copied to clipboard! Share it with friends.", "success");
    hideViralPrompt();
  }
});

// We need to call showViralPrompt() inside downloadFormat() and downloadAudio() 
// when the download is successful. Since we can't easily hook into the exact moment 
// a stream finishes in the browser natively via window.location.href, we can just call it
// right after we trigger the download.

// ------------------------------------------------------
// 1. Theme Toggle Logic
// ------------------------------------------------------
const themeToggleBtn = document.getElementById("themeToggleBtn");
if (themeToggleBtn) {
  const currentTheme = localStorage.getItem("tap2save_theme") || "dark";

  if (currentTheme === "light") {
    document.body.setAttribute("data-theme", "light");
    themeToggleBtn.textContent = "☀️";
  } else {
    document.body.removeAttribute("data-theme");
    themeToggleBtn.textContent = "🌙";
  }

  themeToggleBtn.addEventListener("click", () => {
    if (document.body.getAttribute("data-theme") === "light") {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("tap2save_theme", "dark");
      themeToggleBtn.textContent = "🌙";
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("tap2save_theme", "light");
      themeToggleBtn.textContent = "☀️";
    }
  });
}

// ------------------------------------------------------
// 2. Multi-Language Support
// ------------------------------------------------------
const translations = {
  en: {
    heroTitle: 'Download Videos from',
    heroSub: 'Paste any link from YouTube, Instagram, TikTok, Facebook, Snapchat, or Twitter — get your video in HD quality in seconds.',
    getBtn: 'Get Video',
    trimOpt: '✂️ Trim Video (Optional):',
    pastePlaceholder: 'Paste video URL here... (e.g. https://youtube.com/watch?v=...)',
    pasteGoBtn: 'Paste & Go',
    pasteHint: '💡 Tip: Press <kbd>Ctrl</kbd><kbd>Enter</kbd> to fetch · <kbd>Ctrl</kbd><kbd>V</kbd> auto-pastes URL',
    historyTitle: '📥 Download History',
    historyClear: 'Clear All',
    historyEmpty: 'No downloads yet. Start downloading videos!',
    whyChooseTitle: 'Why Choose Tap2save?',
    whyChooseSub: 'Everything you need, nothing you don\'t.',
    faqTitle: 'Frequently Asked Questions',
    poweredBy: '<span>⚡</span> Powered by yt-dlp Engine',
    anyPlatform: 'Any Platform',
    freeForever: '✦ Free Forever',
    downloads: 'downloads',
    features: [
      { n: 'Lightning Fast', d: 'Direct extraction from platform CDNs. No re-encoding, maximum speed.' },
      { n: 'HD Quality', d: 'Choose from 144p to 4K. Always get the best available quality.' },
      { n: 'Mobile Friendly', d: 'Works perfectly on every screen size — phones, tablets, desktops.' },
      { n: 'Secure & Private', d: 'No login required. URLs are never stored. Your privacy is protected.' },
      { n: 'MP3 Extraction', d: 'Extract high quality audio from any video with one click.' },
      { n: '6+ Platforms', d: 'YouTube, Instagram, TikTok, Facebook, Snapchat, Twitter/X — all in one place.' }
    ],
    howTitle: 'How It Works',
    howSub: 'Three simple steps to download any video.',
    steps: [
      { l: 'Select Platform & Content Type', d: 'Choose your platform (YouTube, Instagram, TikTok etc.) and content type (Reel, Video, Story...) from the toolbar above.' },
      { l: 'Paste the Video URL', d: 'Copy the link and paste it in the box. Click "Get Video" to fetch all available formats.' },
      { l: 'Choose Quality & Download', d: 'Pick your preferred quality from the popup — 4K, 1080p, 720p, or MP3 audio only. Download starts instantly.' }
    ],
    faqSub: 'Everything you need to know about Tap2save',
    faqs: [
      { q: 'Is this video downloader really free?', a: 'Yes! Tap2save is 100% free to use. There are no hidden fees, subscriptions, or limits on how many videos you can download.' },
      { q: 'Can I download Instagram Reels and Facebook private videos?', a: 'Absolutely. Using our advanced \'Settings\' feature, you can add your browser cookies to download private videos and reels securely.' },
      { q: 'Do you support 4K video downloads?', a: 'Yes, if the original video is available in 4K, we will provide you the option to download it in full Ultra-HD quality.' }
    ],
    footerLinks: ['Privacy Policy', 'Terms of Service', 'DMCA', 'Contact'],
    footerLegal: '⚠️ This tool is for personal use only. Downloading copyrighted content without permission may violate platform Terms of Service and local copyright laws. Please respect content creators\' rights.',
    shareTitle: 'Love using Tap2save?',
    shareText: 'Help us keep it 100% free forever! Share Tap2save with your friends so they can download their favorite videos too.',
    shareBtn: '📤 Share with Friends',
    notNowBtn: 'Maybe later'
  },
  hi: {
    heroTitle: 'यहाँ से वीडियो डाउनलोड करें',
    heroSub: 'YouTube, Instagram, TikTok या किसी भी प्लेटफॉर्म का लिंक यहाँ पेस्ट करें और HD क्वालिटी में वीडियो प्राप्त करें।',
    getBtn: 'वीडियो डाउनलोड करें',
    trimOpt: '✂️ वीडियो ट्रिम करें (वैकल्पिक):',
    pastePlaceholder: 'यहाँ वीडियो का लिंक पेस्ट करें... (जैसे https://youtube.com/...)',
    pasteGoBtn: 'पेस्ट करें',
    pasteHint: '💡 सुझाव: लाने के लिए <kbd>Ctrl</kbd><kbd>Enter</kbd> दबाएं · पेस्ट के लिए <kbd>Ctrl</kbd><kbd>V</kbd>',
    historyTitle: '📥 डाउनलोड इतिहास',
    historyClear: 'सभी साफ़ करें',
    historyEmpty: 'अभी तक कोई डाउनलोड नहीं। वीडियो डाउनलोड करना शुरू करें!',
    whyChooseTitle: 'Tap2save क्यों चुनें?',
    whyChooseSub: 'वह सब कुछ जो आपको चाहिए।',
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    poweredBy: '<span>⚡</span> yt-dlp इंजन द्वारा संचालित',
    anyPlatform: 'किसी भी प्लेटफॉर्म',
    freeForever: '✦ मुफ़्त',
    downloads: 'डाउनलोड्स',
    features: [
      { n: 'बिजली जैसी तेज़', d: 'प्लेटफॉर्म CDN से सीधा डाउनलोड। कोई री-एन्कोडिंग नहीं, अधिकतम गति।' },
      { n: 'HD क्वालिटी', d: '144p से 4K तक चुनें। हमेशा सर्वोत्तम क्वालिटी प्राप्त करें।' },
      { n: 'मोबाइल के अनुकूल', d: 'हर स्क्रीन आकार पर पूरी तरह से काम करता है — फोन, टैबलेट, डेस्कटॉप।' },
      { n: 'सुरक्षित और निजी', d: 'लॉगिन की आवश्यकता नहीं। URL कभी स्टोर नहीं किए जाते। आपकी गोपनीयता सुरक्षित है।' },
      { n: 'MP3 ऑडियो', d: 'एक क्लिक के साथ किसी भी वीडियो से उच्च गुणवत्ता वाला ऑडियो निकालें।' },
      { n: '6+ प्लेटफॉर्म', d: 'YouTube, Instagram, TikTok, Facebook, Snapchat, Twitter/X — सब एक ही स्थान पर।' }
    ],
    howTitle: 'यह कैसे काम करता है',
    howSub: 'किसी भी वीडियो को डाउनलोड करने के 3 आसान तरीके।',
    steps: [
      { l: 'प्लेटफॉर्म चुनें', d: 'ऊपर दिए गए टूलबार से अपना प्लेटफॉर्म (YouTube, Instagram, TikTok आदि) चुनें।' },
      { l: 'वीडियो URL पेस्ट करें', d: 'लिंक को कॉपी करें और बॉक्स में पेस्ट करें। "वीडियो डाउनलोड करें" पर क्लिक करें।' },
      { l: 'क्वालिटी चुनें और डाउनलोड करें', d: 'पॉपअप से अपनी पसंदीदा क्वालिटी चुनें — 4K, 1080p, 720p, या केवल MP3। डाउनलोड तुरंत शुरू होता है।' }
    ],
    faqSub: 'Tap2save के बारे में जो आपको जानना चाहिए',
    faqs: [
      { q: 'क्या यह वीडियो डाउनलोडर वास्तव में मुफ़्त है?', a: 'हाँ! Tap2save उपयोग करने के लिए 100% मुफ़्त है। कोई छिपी हुई फीस या सदस्यता नहीं है।' },
      { q: 'क्या मैं Instagram Reels और Facebook प्राइवेट वीडियो डाउनलोड कर सकता हूँ?', a: 'बिल्कुल। सेटिंग्स का उपयोग करके, आप कुकीज़ जोड़कर प्राइवेट वीडियो डाउनलोड कर सकते हैं।' },
      { q: 'क्या आप 4K वीडियो का समर्थन करते हैं?', a: 'हाँ, यदि मूल वीडियो 4K में उपलब्ध है, तो हम अल्ट्रा-HD क्वालिटी में डाउनलोड करने का विकल्प प्रदान करेंगे।' }
    ],
    footerLinks: ['गोपनीयता नीति', 'सेवा की शर्तें', 'DMCA', 'संपर्क करें'],
    footerLegal: '⚠️ यह उपकरण केवल व्यक्तिगत उपयोग के लिए है। बिना अनुमति के कॉपीराइट सामग्री डाउनलोड करना नियमों का उल्लंघन कर सकता है।',
    shareTitle: 'क्या आपको Tap2save पसंद है?',
    shareText: 'इसे मुफ़्त रखने में हमारी मदद करें! Tap2save को अपने दोस्तों के साथ शेयर करें।',
    shareBtn: '📤 दोस्तों के साथ शेयर करें',
    notNowBtn: 'शायद बाद में'
  }
};

const languageSelect = document.getElementById("languageSelect");

function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;
  
  const heroTitleEl = document.querySelector(".hero-title");
  if (heroTitleEl) {
    const span = heroTitleEl.querySelector(".gradient-word");
    if (span) span.textContent = dict.anyPlatform;
    heroTitleEl.innerHTML = dict.heroTitle + "<br />";
    if (span) heroTitleEl.appendChild(span);
  }
  
  const heroSubEl = document.getElementById("heroSub");
  if (heroSubEl) heroSubEl.textContent = dict.heroSub;
  
  const btnTextEl = document.getElementById("btnText");
  if (btnTextEl) btnTextEl.textContent = dict.getBtn;
  
  const trimmerLabel = document.querySelector(".trimmer-label");
  if (trimmerLabel) trimmerLabel.textContent = dict.trimOpt;

  const urlInput = document.getElementById("urlInput");
  if (urlInput) urlInput.placeholder = dict.pastePlaceholder;

  const pasteGoBtn = document.getElementById("pasteGoBtn");
  if (pasteGoBtn) {
    pasteGoBtn.innerHTML = `<span>📋</span> ${dict.pasteGoBtn}`;
  }

  const pasteHint = document.querySelector(".paste-hint");
  if (pasteHint) pasteHint.innerHTML = dict.pasteHint;

  const historyTitle = document.querySelector(".history-title");
  if (historyTitle) historyTitle.textContent = dict.historyTitle;

  const historyClearBtn = document.getElementById("historyClearBtn");
  if (historyClearBtn) historyClearBtn.textContent = dict.historyClear;

  const historyEmpty = document.querySelector(".history-empty");
  if (historyEmpty) historyEmpty.textContent = dict.historyEmpty;

  const sections = document.querySelectorAll(".section-title");
  if (sections.length >= 3) {
    sections[0].textContent = dict.whyChooseTitle;
    sections[1].textContent = dict.howTitle;
    sections[2].textContent = dict.faqTitle;
  }
  
  const sectionSubs = document.querySelectorAll(".section-sub");
  if (sectionSubs.length >= 3) {
    sectionSubs[0].textContent = dict.whyChooseSub;
    sectionSubs[1].textContent = dict.howSub;
    sectionSubs[2].textContent = dict.faqSub;
  }
  
  const eyebrow = document.querySelector(".hero-eyebrow");
  if (eyebrow) eyebrow.innerHTML = dict.poweredBy;
  
  const headerBadge = document.getElementById("headerBadge");
  if (headerBadge) {
    if (selectedPlatform && PLATFORM_CONFIG[selectedPlatform]) {
      const cfg = PLATFORM_CONFIG[selectedPlatform];
      headerBadge.innerHTML = `${cfg.icon} ${cfg.label}`;
    } else {
      headerBadge.textContent = dict.freeForever;
    }
  }
  
  const headerStats = document.getElementById("headerStats");
  if (headerStats) {
    const val = document.getElementById("dlCountBadge") ? document.getElementById("dlCountBadge").textContent : "0";
    headerStats.innerHTML = `<span class="stats-icon">⬇️</span> <span id="dlCountBadge">${val}</span> ${dict.downloads}`;
  }

  const fNames = document.querySelectorAll(".feature-name");
  const fDescs = document.querySelectorAll(".feature-desc");
  dict.features.forEach((f, i) => {
    if (fNames[i]) fNames[i].textContent = f.n;
    if (fDescs[i]) fDescs[i].textContent = f.d;
  });

  const sLabels = document.querySelectorAll(".step-label");
  const sDescs = document.querySelectorAll(".step-desc");
  dict.steps.forEach((s, i) => {
    if (sLabels[i]) sLabels[i].textContent = s.l;
    if (sDescs[i]) sDescs[i].textContent = s.d;
  });

  const faqQs = document.querySelectorAll(".faq-q span:first-child");
  const faqAs = document.querySelectorAll(".faq-a p");
  dict.faqs.forEach((f, i) => {
    if (faqQs[i]) faqQs[i].textContent = f.q;
    if (faqAs[i]) faqAs[i].textContent = f.a;
  });

  const fLinks = document.querySelectorAll(".footer-links a");
  dict.footerLinks.forEach((l, i) => {
    if (fLinks[i]) fLinks[i].textContent = l;
  });

  const fLegal = document.querySelector(".footer-legal");
  if (fLegal) fLegal.textContent = dict.footerLegal;

  const shareTitle = document.getElementById("viralShareTitle");
  if (shareTitle) shareTitle.textContent = dict.shareTitle;
  
  const shareBtn = document.getElementById("btnShareApp");
  if (shareBtn) shareBtn.innerHTML = dict.shareBtn;

  const notNowBtn = document.getElementById("btnNotNow");
  if (notNowBtn) notNowBtn.textContent = dict.notNowBtn;
  
  const shareText = document.querySelector("#viralShareModal p");
  if (shareText) shareText.textContent = dict.shareText;
}

if (languageSelect) {
  languageSelect.addEventListener("change", (e) => {
    applyLanguage(e.target.value);
  });
}

// ------------------------------------------------------
// 3. Live Progress Bar SSE
// ------------------------------------------------------
function listenToProgress(downloadId) {
  if (currentEventSource && typeof currentEventSource.close === 'function') {
    currentEventSource.close();
  }
  
  const progressBar = document.getElementById("dlProgressBar");
  const progressText = document.getElementById("dlProgressText");
  const statusText = document.getElementById("dlStatusText");
  
  if (progressBar) progressBar.style.width = "0%";
  if (progressText) progressText.textContent = "0%";
  if (statusText) statusText.innerHTML = 'Downloading...<span class="loader-dots"></span>';
  
  currentEventSource = new EventSource(`${API_BASE}/progress/${downloadId}`);
  
  currentEventSource.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.progress) {
        if (progressBar) progressBar.style.width = data.progress + "%";
        if (progressText) progressText.textContent = data.progress + "%";
      }
      if (data.status) {
        if (statusText) statusText.textContent = data.status;
      }
      if (data.done) {
        currentEventSource.close();
        if (statusText) statusText.textContent = "Download Complete!";
        if (progressBar) progressBar.style.width = "100%";
        if (progressText) progressText.textContent = "100%";
      }
    } catch(err) {}
  };
  
  currentEventSource.onerror = () => {
    currentEventSource.close();
  };
}
