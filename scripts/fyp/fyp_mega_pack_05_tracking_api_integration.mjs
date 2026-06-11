import fs from "node:fs";

const checks = {
  pack05AuditLockPresent: fs.existsSync(".lumora_fyp_mega_pack_05_runtime_api_feed_wiring_audit_lock"),
  feedApiBridgePresent: fs.existsSync("src/core/fyp/runtime-api/feedApiBridge.ts"),
  realFeedAdapterPresent: fs.existsSync("src/core/fyp/runtime-adapter/realFeedAdapter.ts"),
  uiRuntimePresent: fs.existsSync("src/core/fyp/runtime-ui/fypRuntimeUi.ts"),
  trackingRuntimePresent: fs.existsSync("src/core/fyp/runtime-tracking/fypRuntimeTracking.ts"),
  trackingTestsPresent: fs.existsSync("tests/fyp/fyp_mega_pack_05_tracking_api_integration.test.ts")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_05_TRACKING_API_INTEGRATION",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_05_TRACKING_API_INTEGRATION_READY"
    : "FYP_MEGA_PACK_05_TRACKING_API_INTEGRATION_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-05-tracking-api-integration.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-05-tracking-api-integration.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-05-tracking-api-integration.md", [
  "# FYP Mega Pack 05/07 — Tracking API Integration",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_05_tracking_api_integration_lock", "FYP_MEGA_PACK_05_TRACKING_API_INTEGRATION=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_tracking_api_integration_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_05_tracking_api_integration_failed_lock", "FYP_MEGA_PACK_05_TRACKING_API_INTEGRATION=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_tracking_api_integration_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
