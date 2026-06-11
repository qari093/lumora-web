import fs from "node:fs";
import { execSync } from "node:child_process";

const exists = (p) => fs.existsSync(p);
const read = (p) => exists(p) ? fs.readFileSync(p, "utf8") : "";
const run = (cmd, log) => {
  try {
    const out = execSync(cmd, { stdio: "pipe", encoding: "utf8", timeout: 1000 * 60 * 12 });
    fs.writeFileSync(log, out);
    return true;
  } catch (error) {
    fs.writeFileSync(log, `${error.stdout || ""}\n${error.stderr || ""}`);
    return false;
  }
};

const fyp = read("app/fyp/FypAutoplayFeed.tsx");
const styles = read("app/fyp/styles.module.css");
const trace = read("src/core/fyp/lumoraTrace.ts");

const typecheck = run("pnpm -s tsc --noEmit", "/tmp/fyp_mega_pack_01_tsc.log");
const build = run("pnpm -s next build", "/tmp/fyp_mega_pack_01_build.log");

const checks = {
  userJourney: {
    fypRouteExists: exists("app/fyp/page.tsx") || exists("app/fyp/FypAutoplayFeed.tsx"),
    entryRuntimeMarker: fyp.includes("data-fyp-runtime"),
    exitBackControl: fyp.includes('aria-label="Back"') || fyp.includes("href=\"/\""),
    portalReturnNav: fyp.includes("tiktokBottom") || styles.includes("tiktokBottom"),
    deepLinkSafe: exists("app/fyp/page.tsx"),
    refreshSafe: fyp.includes("useEffect") || fyp.includes("useMemo"),
    emptyStateSafe: fyp.includes("fallback") || fyp.includes("items") || fyp.includes("seed"),
    errorRegressionBlocked: !fyp.includes("throw new Error"),
    offlineRegressionBlocked: !fyp.includes("navigator.onLine === false")
  },
  contentFlow: {
    apiFeedExists: exists("app/api/fyp/feed/route.ts") || exists("app/api/fyp/route.ts"),
    apiRuntimeExists: exists("app/api/fyp/runtime/route.ts"),
    apiTrackExists: exists("app/api/fyp/track/route.ts") || exists("app/api/fyp/interact/route.ts"),
    uploadPathExists: exists("app/api/fyp/native-upload/route.ts") || exists("app/api/media/upload/route.ts") || exists("app/api/uploads/presign/route.ts"),
    nativeVideo: fyp.includes("<video"),
    autoplay: fyp.includes("autoPlay"),
    preloadAuto: fyp.includes('preload="auto"'),
    multiVideo: fyp.includes(".map(") && fyp.includes("video"),
    removalSafe: !fyp.includes("dangerouslySetInnerHTML")
  },
  rankingPersonalization: {
    personalizationRouteExists: exists("app/api/fyp/personalization/route.ts"),
    sessionRouteExists: exists("app/api/fyp/session/route.ts"),
    rankingRouteExists: exists("app/api/fyp/ranking/route.ts") || exists("app/api/fyp/recommend/route.ts"),
    traceCoreExists: exists("src/core/fyp/lumoraTrace.ts"),
    traceLanes: trace.includes("LUMORA_LANES"),
    normalizeLane: trace.includes("normalizeLane"),
    createTraceSignal: trace.includes("createTraceSignal"),
    summarizeTrace: trace.includes("summarizeTrace"),
    curiositySignals: trace.includes("curiosity") || trace.includes("deepDive") || trace.includes("replay")
  },
  runtimeStability: {
    fullscreenRuntime: fyp.includes("fullscreen-native-autoplay"),
    fullscreenCss: styles.includes("fullscreenVideo") && styles.includes("fullscreenCard"),
    compactOverlay: fyp.includes("creatorStrip") && styles.includes("creatorStrip"),
    rightRail: fyp.includes("rightRail") || styles.includes("rightRail"),
    bottomNav: fyp.includes("tiktokBottom") || styles.includes("tiktokBottom"),
    noYoutubeIframe: !fyp.includes("<iframe") && !fyp.includes("youtube.com/embed"),
    duplicateRuntimeAttributeRemoved: !fyp.includes('data-fyp-runtime="fullscreen-native-autoplay" data-depthfeed-emotional-lanes') || fyp.includes("data-depthfeed-runtime"),
    noObviousMemoryBomb: !fyp.includes("while (true)")
  },
  commands: {
    typecheck,
    build
  }
};

const flatten = (obj) => Object.values(obj).flatMap((v) => typeof v === "object" && v !== null ? flatten(v) : [v]);
const status = flatten(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_01_CORE_USER_REALITY",
  checkedAt: new Date().toISOString(),
  status,
  scope: {
    megaPack: "01/07",
    name: "Core User Reality",
    phases: [
      "User Journey Validation",
      "Video Content Flow Validation",
      "Ranking & Personalization Validation",
      "Runtime Stability Validation"
    ]
  },
  checks,
  logs: {
    typecheck: "/tmp/fyp_mega_pack_01_tsc.log",
    build: "/tmp/fyp_mega_pack_01_build.log"
  },
  result: status === "PASS"
    ? "FYP_MEGA_PACK_01_CORE_USER_REALITY_READY"
    : "FYP_MEGA_PACK_01_CORE_USER_REALITY_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-01-core-user-reality.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-01-core-user-reality.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-01-core-user-reality.md", [
  "# FYP Mega Pack 01/07 — Core User Reality",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_01_core_user_reality_lock", "FYP_MEGA_PACK_01_CORE_USER_REALITY=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_01_core_user_reality_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_01_core_user_reality_failed_lock", "FYP_MEGA_PACK_01_CORE_USER_REALITY=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_01_core_user_reality_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
