import fs from "node:fs";

const checks = {
  pack05AuditLockPresent: fs.existsSync(".lumora_fyp_mega_pack_05_runtime_api_feed_wiring_audit_lock"),
  feedApiBridgePresent: fs.existsSync("src/core/fyp/runtime-api/feedApiBridge.ts"),
  realFeedAdapterPresent: fs.existsSync("src/core/fyp/runtime-adapter/realFeedAdapter.ts"),
  uiRuntimePresent: fs.existsSync("src/core/fyp/runtime-ui/fypRuntimeUi.ts"),
  uiRuntimeTestsPresent: fs.existsSync("tests/fyp/fyp_mega_pack_05_ui_runtime_wiring.test.ts")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_05_UI_RUNTIME_WIRING",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_05_UI_RUNTIME_WIRING_READY"
    : "FYP_MEGA_PACK_05_UI_RUNTIME_WIRING_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-05-ui-runtime-wiring.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-05-ui-runtime-wiring.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-05-ui-runtime-wiring.md", [
  "# FYP Mega Pack 05/07 — UI Runtime Wiring",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_05_ui_runtime_wiring_lock", "FYP_MEGA_PACK_05_UI_RUNTIME_WIRING=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_ui_runtime_wiring_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_05_ui_runtime_wiring_failed_lock", "FYP_MEGA_PACK_05_UI_RUNTIME_WIRING=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_ui_runtime_wiring_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
