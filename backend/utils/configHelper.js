const fs = require("fs");
const path = require("path");

const COOKIES_PATH = path.join(__dirname, "..", "cookies.txt");

function getCookiesArgs() {
  if (fs.existsSync(COOKIES_PATH)) {
    return ["--cookies", COOKIES_PATH];
  }
  return [];
}

module.exports = { COOKIES_PATH, getCookiesArgs };
