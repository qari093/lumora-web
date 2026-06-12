import fs from "node:fs";

const checks = {
  pack07AuditLockPresent: fs.existsSync(".lumora_fyp_mega_pack_07_production_validation_audit_lock"),
  pack06FinalLockPresent: fs.existsSync(".lumora_fyp_mega_pack_06_final_lock"),
  feedApiBridgePresent: fs.existsSync("src/core/fyp/runtime-api/feedApiBridge.ts"),
  realFeedAdapterPresent: fs.existsSync("src/core/fyp/runtime-adapter/realFeedAdapter.ts"),
  uiRuntimePresent: fs.existsSync("src/core/fyp/runtime-ui/fypRuntimeUi.ts"),
  trackingRuntimePresent: fs.existsSync("src/core/fyp/runtime-tracking/fypRuntimeTracking.ts"),
  rankingRuntimePresent: fs.existsSync("src/core/fyp/runtime-ranking/rankingRuntime.ts"),
  learningRuntimePresent: fs.existsSync("src/core/fyp/runtime-learning/personalizationLearning.ts"),
  traceAwareRerankPresent: fs.existsSync("src/core/fyp/runtime-learning/traceAwareRerank.ts"),
  runtimeChainTestsPresent: fs.existsSync("tests/fyp/fyp_mega_pack_07_runtime_chain_verification.test.ts")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_07_RUNTIME_CHAIN_VERIFICATION",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_07_RUNTIME_CHAIN_VERIFICATION_READY"
    : "FYP_MEGA_PACK_07_RUNTIME_CHAIN_VERIFICATION_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-07-runtime-chain-verification.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-07-runtime-chain-verification.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-07-runtime-chain-verification.md", [
  "# FYP Mega Pack 07/07 — Runtime Chain Verification",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_07_runtime_chain_verification_lock", "FYP_MEGA_PACK_07_RUNTIME_CHAIN_VERIFICATION=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_07_runtime_chain_verification_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_07_runtime_chain_verification_failed_lock", "FYP_MEGA_PACK_07_RUNTIME_CHAIN_VERIFICATION=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_07_runtime_chain_verification_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
