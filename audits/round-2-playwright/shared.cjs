/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://localhost:3010";
const outDir = __dirname;

const changedPages = [
  "/awnings",
  "/awnings/straight-drop-awnings",
  "/awnings/auto-awnings",
  "/awnings/fixed-guide-awnings",
  "/awnings/motorised-outdoor-blinds",
  "/awnings/wire-guide-awnings",
  "/curtains",
  "/curtains/double-curtains",
  "/curtains/gathered-curtains",
  "/blinds",
  "/security",
  "/shutters",
];

const newPageExpectations = {
  "/awnings/straight-drop-awnings": {
    title: "Straight Drop Awnings",
    hero: "mcb-straight-drop-awning-hero.webp",
    requiredText: ["Simple vertical shade", "Straight Drop Awnings Melbourne"],
  },
  "/awnings/auto-awnings": {
    title: "Auto Awnings",
    hero: "mcb-auto-awning-hero.webp",
    requiredText: ["Auto Awnings Melbourne", "exterior shade"],
  },
  "/awnings/fixed-guide-awnings": {
    title: "Fixed Guide Awnings",
    hero: "mcb-fixed-guide-awning-hero.webp",
    requiredText: ["Fixed Guide Awnings Melbourne", "Guided exterior shade"],
  },
  "/awnings/motorised-outdoor-blinds": {
    title: "Motorised Outdoor Blinds",
    hero: "mcb-motorised-outdoor-blinds-hero.webp",
    requiredText: ["Motorised Outdoor Blinds Melbourne", "Remote control"],
  },
  "/awnings/wire-guide-awnings": {
    title: "Wire Guide Awnings",
    hero: "mcb-wire-guide-awning-hero.webp",
    requiredText: ["Wire Guide Awnings Melbourne", "Slim side guidance"],
  },
  "/curtains/double-curtains": {
    title: "Double Curtains",
    hero: "mcb-double-curtains-hero.webp",
    requiredText: ["Double Curtains Melbourne", "Sheer softness"],
  },
  "/curtains/gathered-curtains": {
    title: "Gathered Curtains",
    hero: "mcb-gathered-curtains-hero.webp",
    requiredText: ["Gathered Curtains Melbourne", "Relaxed fullness"],
  },
};

const retiredRoutes = {
  "/awnings/outdoor-blinds": "/awnings",
  "/awnings/window-awnings": "/awnings/auto-awnings",
  "/curtains/s-fold": "/curtains/s-fold-curtains",
  "/curtains/velvet-curtains": "/curtains/velvet",
};

function fullUrl(route) {
  return new URL(route, baseUrl).toString();
}

function writeJson(name, data) {
  const target = path.join(outDir, name);
  fs.writeFileSync(target, JSON.stringify(data, null, 2) + "\n");
  return target;
}

function normaliseAsset(raw) {
  if (!raw) return "";
  let value = raw;
  const nextMatch = value.match(/[?&]url=([^&]+)/);
  if (nextMatch) value = decodeURIComponent(nextMatch[1]);
  value = value.replace(/^https?:\/\/[^/]+/, "");
  return value;
}

async function withBrowser(fn) {
  const browser = await chromium.launch();
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}

module.exports = {
  baseUrl,
  changedPages,
  fullUrl,
  newPageExpectations,
  normaliseAsset,
  retiredRoutes,
  writeJson,
  withBrowser,
};
