import fs from "node:fs";

const component = fs.existsSync("app/fyp/FypAutoplayFeed.tsx")
  ? fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8")
  : "";

const page = fs.existsSync("app/fyp/page.tsx")
  ? fs.readFileSync("app/fyp/page.tsx", "utf8")
  : "";

const css = fs.existsSync("app/fyp/styles.module.css")
  ? fs.readFileSync("app/fyp/styles.module.css", "utf8")
  : "";

const checks = {
  clientComponentExists: component.includes('"use client"'),
  usesIntersectionObserver: component.includes("IntersectionObserver"),
  usesMutedAutoplay: component.includes("autoplay") && component.includes("mute") && component.includes("playsinline"),
  usesNoCookieEmbed: component.includes("youtube-nocookie.com/embed"),
  routeDelegatesToAutoplay: page.includes("FypAutoplayFeed"),
  playerStylesExist: css.includes(".playerShell") && css.includes(".videoFrame") && css.includes(".cardActive"),
  noOldLoadingShell: !page.includes("Loading FYP")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "FYP_AUTOPLAY_SCROLL_FEED_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MUTED_AUTOPLAY_SCROLL_ENGINE_READY_FOR_IPHONE_REVIEW"
    : "FYP_AUTOPLAY_SCROLL_ENGINE_INCOMPLETE"
};

fs.writeFileSync("data/fyp/autoplay-scroll-feed-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-autoplay-scroll-feed-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/autoplay-scroll-feed-audit.md", `# FYP Autoplay Scroll Feed Audit

Status: ${status}

Result: ${report.result}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
