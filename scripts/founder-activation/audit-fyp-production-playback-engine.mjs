import fs from "node:fs";

const component = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");
const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");
const source = fs.readFileSync("src/core/fyp/fullscreenSourceFeed.ts", "utf8");

const checks = {
  activeController: component.includes("IntersectionObserver") && component.includes("safePlay(video)") && component.includes("pauseVideo(video)"),
  nativeVideoOnly: component.includes("<video") && !component.includes("<iframe") && !component.includes("youtube-nocookie.com/embed"),
  fullscreenCss: css.includes("height: 100svh") && css.includes("scroll-snap-type: y mandatory") && css.includes("object-fit: cover"),
  noBlurFilter: css.includes("filter: none") && !css.includes("blur("),
  rightRail: css.includes(".rightRail"),
  bottomNav: css.includes(".tiktokBottom"),
  sourceCount48: (source.match(/\["/g) || []).length >= 48,
  directMp4Pool: source.includes(".mp4") && source.includes("directVideoPool"),
  highQualityPosterPool: source.includes("images.unsplash.com")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "FYP_PRODUCTION_PLAYBACK_ENGINE_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_PLAYBACK_ENGINE_READY_FOR_IPHONE_VISUAL_REVIEW"
    : "FYP_PLAYBACK_ENGINE_NEEDS_FIX"
};

fs.writeFileSync("data/fyp/production-playback-engine-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-production-playback-engine-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(
  "docs/fyp/production-playback-engine-audit.md",
  `# FYP Production Playback Engine Audit\n\nStatus: ${status}\n\nResult: ${report.result}\n`
);

console.log(JSON.stringify(report, null, 2));

if (status !== "PASS") process.exit(1);
