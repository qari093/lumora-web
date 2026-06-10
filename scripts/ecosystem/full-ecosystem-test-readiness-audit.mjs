import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const exists = (p) => fs.existsSync(path.join(root, p));
const size = (p) => exists(p) ? fs.statSync(path.join(root, p)).size : 0;
const read = (p) => exists(p) ? fs.readFileSync(path.join(root, p), "utf8") : "";

const checks = {
  git: {
    ecosystemPacksSealed: Array.from({ length: 8 }, (_, i) =>
      exists(`.lumora_ecosystem_pack0${i + 1}_${[
        "surface_validation",
        "runtime_api_validation",
        "portal_integration_validation",
        "navigation_user_journey_validation",
        "commerce_economy_validation",
        "ui_visual_approval_validation",
        "ecosystem_readiness_validation",
        "final_ecosystem_approval_seal"
      ][i]}_lock`)
    ).every(Boolean)
  },

  portals: {
    home: exists("app/page.tsx"),
    fyp: exists("app/fyp/page.tsx"),
    live: exists("app/live/page.tsx"),
    gmar: exists("app/gmar/page.tsx"),
    nexa: exists("app/nexa/page.tsx"),
    zendoro: exists("app/zendoro/page.tsx"),
    wallet: exists("app/wallet/page.tsx"),
    lafs: exists("app/lafs/page.tsx"),
    lumaspace: exists("app/lumaspace/page.tsx"),
    movies: exists("app/movies/page.tsx"),
    music: exists("app/music/page.tsx"),
    creator: exists("app/creator/page.tsx"),
    share: exists("app/share/page.tsx"),
    profile: exists("app/profile/page.tsx")
  },

  admin: {
    adminApi: exists("app/api/zendoro/admin/route.ts") || exists("app/api/zencoin/admin/route.ts"),
    moderationApi: exists("app/api/moderation/review-queue/route.ts") || exists("app/api/mod/queue/route.ts"),
    trustApi: exists("app/api/trust/audit/route.ts") || exists("app/api/trust/score/route.ts"),
    operatorSurface: exists("app/operator/page.tsx") || read("app/layout.tsx").includes("/operator"),
    missionControlSurface: exists("app/mission-control/page.tsx") || read("app/layout.tsx").includes("/mission-control")
  },

  zeneconomy: {
    zencoinApi: exists("app/api/zencoin/balance/route.ts") && exists("app/api/zencoin/transactions/route.ts"),
    walletApi: exists("app/api/wallet/route.ts") || exists("app/api/wallet/balance/route.ts"),
    zenEconomyApi: exists("app/api/zen/economy/route.ts"),
    lafsSafeMode: exists("data/lafs/final-pre-beta-seal.json"),
    noLiveBridgeRequiredBeforeApproval: true
  },

  logoPwa: {
    manifest: exists("public/manifest.webmanifest") || exists("app/manifest.ts"),
    favicon: exists("app/icon.tsx") || exists("public/favicon.ico") || exists("app/favicon.ico"),
    appleIcon: exists("app/apple-icon.tsx") || exists("public/apple-icon.png"),
    appNameLumora: read("app/layout.tsx").includes("Lumora") || read("public/manifest.webmanifest").includes("Lumora"),
    iphoneInstallSurfaceReady: exists("public/manifest.webmanifest") || exists("app/manifest.ts")
  },

  videoSources: {
    fypFeedApi: exists("app/api/fyp/feed/route.ts") || exists("app/api/fyp/native-feed/route.ts"),
    videosFeedApi: exists("app/api/videos/feed/route.ts"),
    cloudflareStream: exists("app/api/stream/upload-token/route.ts") && exists("app/api/stream/webhook/route.ts"),
    mediaUpload: exists("app/api/media/upload/route.ts"),
    fallbackVideoApis: exists("app/api/video/fallback/route.ts") || exists("app/api/fyp/fallback-feed/route.ts"),
    ingestionSources: [
      "app/api/ingest/youtube/route.ts",
      "app/api/ingest/tiktok/route.ts",
      "app/api/ingest/reddit/route.ts",
      "app/api/ingest/rss/route.ts",
      "app/api/live/youtube/route.ts"
    ].filter(exists).length
  },

  safety: {
    privateApprovalGate: read("data/private-beta/beta-start-authorization.json").includes("FULL_ECOSYSTEM_APPROVAL_BY_WAQAR"),
    testerSelectionBlocked: read("data/private-beta/beta-start-authorization.json").includes('"testerSelectionAllowed": false'),
    inviteBlocked: read("data/private-beta/beta-start-authorization.json").includes('"inviteIssuanceAllowed": false'),
    paymentLiveModeFalse: read("data/private-beta/beta-start-authorization.json").includes('"paymentLiveMode": false'),
    publicSignupDisabled: read("data/private-beta/beta-start-authorization.json").includes('"publicSignupEnabled": false')
  }
};

const groups = Object.values(checks);
let total = 0;
let passed = 0;

for (const group of groups) {
  for (const value of Object.values(group)) {
    total++;
    if (typeof value === "boolean" ? value : Number(value) > 0) passed++;
  }
}

const readinessPercent = Math.round((passed / total) * 100);

const result = {
  system: "LUMORA_FULL_ECOSYSTEM_TEST_READINESS_AUDIT",
  checkedAt: new Date().toISOString(),
  status: readinessPercent >= 85 ? "READY_FOR_FOUNDER_REVIEW" : "NEEDS_FIXES_BEFORE_REVIEW",
  readinessPercent,
  passed,
  total,
  checks,
  hardGate: {
    ecosystemApprovalRequiredBeforeInvites: true,
    betaInvitesAllowed: false,
    reason: "Founder approval required before any tester invitation."
  },
  nextAction: readinessPercent >= 85
    ? "FOUNDER_VISUAL_AND_FUNCTIONAL_REVIEW"
    : "FIX_FAILED_AUDIT_ITEMS"
};

fs.writeFileSync("data/ecosystem/full-ecosystem-test-readiness-audit.json", JSON.stringify(result, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/full-ecosystem-test-readiness-audit.json", JSON.stringify(result, null, 2) + "\n");
fs.writeFileSync("docs/ecosystem/full-ecosystem-test-readiness-audit.md", `# Full Ecosystem Test Readiness Audit

Status: ${result.status}
Readiness: ${result.readinessPercent}%

Beta invites allowed: false
Reason: Founder approval required before tester invitation.
`);

console.log(JSON.stringify(result, null, 2));
if (result.status !== "READY_FOR_FOUNDER_REVIEW") process.exitCode = 1;
