import fs from "node:fs";

const page = fs.readFileSync("app/fyp/page.tsx", "utf8");
const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");
const core = fs.readFileSync("src/core/fyp/youtubeFeed.ts", "utf8");
const routeExists = fs.existsSync("app/api/fyp/youtube-feed/route.ts");

const checks = {
  pageUsesYoutubeFeed: page.includes("fypYoutubeVideos"),
  pageHasThumbnailCards: page.includes("thumbnailUrl") && page.includes("youtubeWatchUrl"),
  pageHasBottomNav: page.includes("bottomNav"),
  pageHasNoVideoTag: !page.includes("<video"),
  cssHasMobileFeed: css.includes(".bottomNav") && css.includes(".thumbWrap") && css.includes("100svh"),
  coreDisablesRehosting: core.includes("rehosting: false"),
  apiRouteExists: routeExists
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "FYP_YOUTUBE_STYLE_FEED_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_YOUTUBE_STYLE_MOBILE_FEED_READY_FOR_IPHONE_REVIEW"
    : "FYP_YOUTUBE_STYLE_FEED_INCOMPLETE"
};

fs.writeFileSync("data/fyp/youtube-style-feed-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-youtube-style-feed-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/youtube-style-feed-audit.md", `# FYP YouTube-Style Feed Audit

Status: ${status}

Result: ${report.result}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
