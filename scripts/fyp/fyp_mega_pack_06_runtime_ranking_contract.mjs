import fs from "node:fs";

const checks = {
  pack06AuditLockPresent: fs.existsSync(".lumora_fyp_mega_pack_06_ranking_learning_audit_lock"),
  pack05FinalLockPresent: fs.existsSync(".lumora_fyp_mega_pack_05_final_lock"),
  uiRuntimePresent: fs.existsSync("src/core/fyp/runtime-ui/fypRuntimeUi.ts"),
  trackingRuntimePresent: fs.existsSync("src/core/fyp/runtime-tracking/fypRuntimeTracking.ts"),
  rankingRuntimePresent: fs.existsSync("src/core/fyp/runtime-ranking/rankingRuntime.ts"),
  rankingTestsPresent: fs.existsSync("tests/fyp/fyp_mega_pack_06_runtime_ranking_contract.test.ts")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_06_RUNTIME_RANKING_CONTRACT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_06_RUNTIME_RANKING_CONTRACT_READY"
    : "FYP_MEGA_PACK_06_RUNTIME_RANKING_CONTRACT_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-06-runtime-ranking-contract.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-06-runtime-ranking-contract.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-06-runtime-ranking-contract.md", [
  "# FYP Mega Pack 06/07 — Runtime Ranking Contract",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_06_runtime_ranking_contract_lock", "FYP_MEGA_PACK_06_RUNTIME_RANKING_CONTRACT=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_runtime_ranking_contract_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_06_runtime_ranking_contract_failed_lock", "FYP_MEGA_PACK_06_RUNTIME_RANKING_CONTRACT=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_runtime_ranking_contract_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
