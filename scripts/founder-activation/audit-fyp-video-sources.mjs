import fs from "node:fs";

const base = process.env.LUMORA_AUDIT_BASE || "https://lumoraverse.io";

const endpoints = [
  "/api/fyp/native-feed",
  "/api/fyp/feed",
  "/api/videos/feed",
  "/api/fyp/fallback-feed",
  "/api/fyp94/feed"
];

const results = [];

for (const endpoint of endpoints) {
  try {
    const res = await fetch(base + endpoint);
    const text = await res.text();

    results.push({
      endpoint,
      status: res.status,
      ok: res.ok,
      bytes: text.length,
      hasVideoUrl: /https?:\/\/|\.mp4|\.m3u8|\.webm|stream|video/i.test(text),
      hasItems: /items|videos|feed|data|results/i.test(text),
      sample: text.slice(0, 300)
    });
  } catch (error) {
    results.push({
      endpoint,
      ok: false,
      error: String(error)
    });
  }
}

const playableSources = results.filter((r) => r.ok && r.hasVideoUrl).length;

const report = {
  system: "FYP_VIDEO_SOURCE_RENDERING_AUDIT",
  checkedAt: new Date().toISOString(),
  base,
  status: playableSources > 0 ? "PASS" : "FAIL",
  playableSources,
  totalSources: endpoints.length,
  results,
  nextAction:
    playableSources > 0
      ? "FIX_FYP_UI_TO_RENDER_VIDEO_ITEMS"
      : "FIX_FYP_VIDEO_FEED_ENDPOINTS_FIRST"
};

fs.writeFileSync(
  "data/founder-activation/fyp-video-source-audit.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  ".lumora-audits/fyp-video-source-audit.json",
  JSON.stringify(report, null, 2) + "\n"
);

console.log(JSON.stringify(report, null, 2));

if (report.status !== "PASS") process.exitCode = 1;
