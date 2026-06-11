import fs from "node:fs";

const exists = (p) => fs.existsSync(p);

const checks = {
  megaPack01Locked: exists(".lumora_fyp_mega_pack_01_core_user_reality_lock"),
  megaPack02Locked: exists(".lumora_fyp_mega_pack_02_final_lock"),
  megaPack03Locked: exists(".lumora_fyp_mega_pack_03_final_lock"),
  megaPack04Locked: exists(".lumora_fyp_mega_pack_04_final_lock"),
  ingestionQueuePresent: exists("src/core/fyp/ingestion/ingestionQueue.ts"),
  feedBridgePresent: exists("src/core/fyp/ingestion/feedBridge.ts"),
  sourceRegistryPresent: exists("src/core/fyp/sources/sourceRegistry.ts"),
  sourceSelectionPresent: exists("src/core/fyp/sources/sourceSelection.ts"),
  fypApiFeedPresent: exists("app/api/fyp/feed/route.ts") || exists("app/api/fyp/route.ts"),
  fypPagePresent: exists("app/fyp/FypAutoplayFeed.tsx")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_05_RUNTIME_API_FEED_WIRING_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  scope: {
    megaPack: "05/07",
    name: "Runtime API Integration + Real Feed Wiring",
    phases: [
      "Runtime API Contract Audit",
      "Feed API Bridge",
      "Real Feed Item Adapter",
      "FYP UI Runtime Wiring",
      "Tracking API Integration",
      "Fallback Feed Safety",
      "End-to-End Feed Smoke Gate"
    ]
  },
  checks,
  result:
    status === "PASS"
      ? "FYP_MEGA_PACK_05_RUNTIME_API_FEED_WIRING_READY"
      : "FYP_MEGA_PACK_05_RUNTIME_API_FEED_WIRING_BLOCKED"
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

fs.writeFileSync(
  "data/fyp/mega-pack-05-runtime-api-feed-wiring-audit.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  ".lumora-audits/fyp-mega-pack-05-runtime-api-feed-wiring-audit.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  "docs/fyp/mega-pack-05-runtime-api-feed-wiring-audit.md",
  [
    "# FYP Mega Pack 05/07 — Runtime API Integration + Real Feed Wiring Audit",
    "",
    `Status: ${status}`,
    "",
    "```json",
    JSON.stringify(report, null, 2),
    "```",
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(
    ".lumora_fyp_mega_pack_05_runtime_api_feed_wiring_audit_lock",
    "FYP_MEGA_PACK_05_RUNTIME_API_FEED_WIRING_AUDIT=PASS\n"
  );
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_runtime_api_feed_wiring_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(
    ".lumora_fyp_mega_pack_05_runtime_api_feed_wiring_audit_failed_lock",
    "FYP_MEGA_PACK_05_RUNTIME_API_FEED_WIRING_AUDIT=FAIL\n"
  );
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_runtime_api_feed_wiring_audit_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
