import fs from "node:fs";

const component = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");
const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

const checks = {
  nativeVideo: component.includes("<video"),
  runtimeMarker: component.includes('data-fyp-runtime="fullscreen-native-autoplay"'),
  compactCreatorStrip: component.includes("creatorStrip"),
  oversizedCopyRemoved: !component.includes("styles.videoInfo") && !component.includes("<h1>{item.title}</h1>"),
  activePreload: component.includes('preload={active ? "auto" : "metadata"}'),
  autoplayCall: component.includes("safePlay(video)"),
  fullScreenCss: css.includes("100svh") && css.includes("object-fit: cover"),
  rightRailExists: component.includes("rightRail"),
  bottomNavExists: component.includes("tiktokBottom")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";
const report = {
  system: "FYP_STEP129_VISUAL_PLAYBACK_COMPACT_OVERLAY_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_VISUAL_PLAYBACK_COMPACT_OVERLAY_READY"
    : "FYP_VISUAL_PLAYBACK_COMPACT_OVERLAY_BLOCKED"
};

fs.mkdirSync(".lumora-audits", { recursive: true });
fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });

fs.writeFileSync(".lumora-audits/fyp-step129-visual-playback-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("data/fyp/step129-visual-playback-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/step129-visual-playback-audit.md", `# FYP Step 129 Visual Playback Audit\n\nStatus: ${status}\n\nResult: ${report.result}\n`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
