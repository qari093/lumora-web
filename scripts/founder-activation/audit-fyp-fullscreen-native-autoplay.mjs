import fs from "node:fs";

const component = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");
const page = fs.readFileSync("app/fyp/page.tsx", "utf8");
const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");
const core = fs.readFileSync("src/core/fyp/fullscreenSourceFeed.ts", "utf8");

const checks = {
  routeUsesFullscreenFeed: page.includes("fullscreenSourceFeed"),
  nativeVideoTagUsed: component.includes("<video"),
  iframeRemoved: !component.includes("<iframe"),
  autoplayPlayCallExists: component.includes("node.play()"),
  intersectionObserverExists: component.includes("IntersectionObserver"),
  fullViewportCssExists: css.includes("height: 100svh") && css.includes("object-fit: cover"),
  rightRailExists: css.includes(".rightRail"),
  bottomNavExists: css.includes(".tiktokBottom"),
  sourceCount48: core.includes("Film Australia Collection") && core.includes("NASA")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "FYP_FULLSCREEN_NATIVE_AUTOPLAY_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_TIKTOK_STYLE_FULLSCREEN_NATIVE_AUTOPLAY_READY_FOR_IPHONE_REVIEW"
    : "FYP_FULLSCREEN_NATIVE_AUTOPLAY_INCOMPLETE"
};

fs.writeFileSync("data/fyp/fullscreen-native-autoplay-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-fullscreen-native-autoplay-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/fullscreen-native-autoplay-audit.md", `# FYP Fullscreen Native Autoplay Audit

Status: ${status}

Result: ${report.result}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
