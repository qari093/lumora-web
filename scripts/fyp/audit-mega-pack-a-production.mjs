import fs from "node:fs";

const url = "https://lumoraverse.io/fyp?mega_pack_a_audit=1";
const html = await fetch(url, { cache: "no-store" }).then((r) => r.text());

const count = (pattern) => (html.match(pattern) || []).length;

const checks = {
  productionReachable: html.includes("<html"),
  runtimeMarker: html.includes('data-fyp-runtime="fullscreen-native-autoplay"'),
  nativeVideos: count(/<video /g) >= 48,
  allAutoPlay: count(/autoPlay=""/g) >= 48,
  allPreloadAuto: count(/preload="auto"/g) >= 48,
  compactCreatorStrip: html.includes("creatorStrip"),
  rightRailExists: html.includes("rightRail"),
  bottomNavExists: html.includes("tiktokBottom"),
  oversizedCopyRemoved: !html.includes("native muted autoplay") || html.includes("48<!-- --> sources"),
  noYoutubeIframe: !html.includes("<iframe")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_A_PRODUCTION_AUDIT",
  checkedAt: new Date().toISOString(),
  url,
  status,
  checks,
  result: status === "PASS"
    ? "MEGA_PACK_A_PRODUCTION_READY"
    : "MEGA_PACK_A_PRODUCTION_BLOCKED"
};

for (const file of [
  "data/fyp/mega-pack-a-production-audit.json",
  ".lumora-audits/fyp-mega-pack-a-production-audit.json"
]) {
  fs.writeFileSync(file, JSON.stringify(report, null, 2) + "\n");
}

fs.writeFileSync(
  "docs/fyp/mega-pack-a-production-audit.md",
  `# FYP Mega Pack A Production Audit\n\nStatus: ${status}\n\nResult: ${report.result}\n\nURL: ${url}\n`
);

fs.writeFileSync(
  ".lumora_fyp_mega_pack_a_production_lock",
  `LUMORA_FYP_MEGA_PACK_A_PRODUCTION=${status}\n`
);

console.log(JSON.stringify(report, null, 2));

if (status !== "PASS") process.exit(1);
