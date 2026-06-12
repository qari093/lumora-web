import fs from "node:fs";

const checks = {
  pack06AuditLockPresent: fs.existsSync(".lumora_fyp_mega_pack_06_ranking_learning_audit_lock"),
  rankingContractLockPresent: fs.existsSync(".lumora_fyp_mega_pack_06_runtime_ranking_contract_lock"),
  personalizationLearningLockPresent: fs.existsSync(".lumora_fyp_mega_pack_06_personalization_learning_lock"),
  rankingRuntimePresent: fs.existsSync("src/core/fyp/runtime-ranking/rankingRuntime.ts"),
  personalizationLearningPresent: fs.existsSync("src/core/fyp/runtime-learning/personalizationLearning.ts"),
  traceAwareRerankPresent: fs.existsSync("src/core/fyp/runtime-learning/traceAwareRerank.ts"),
  traceAwareRerankTestsPresent: fs.existsSync("tests/fyp/fyp_mega_pack_06_trace_aware_rerank.test.ts")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_06_TRACE_AWARE_RERANK",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_06_TRACE_AWARE_RERANK_READY"
    : "FYP_MEGA_PACK_06_TRACE_AWARE_RERANK_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-06-trace-aware-rerank.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-06-trace-aware-rerank.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-06-trace-aware-rerank.md", [
  "# FYP Mega Pack 06/07 — Trace-Aware Rerank + Cold Start Safety",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_06_trace_aware_rerank_lock", "FYP_MEGA_PACK_06_TRACE_AWARE_RERANK=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_trace_aware_rerank_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_06_trace_aware_rerank_failed_lock", "FYP_MEGA_PACK_06_TRACE_AWARE_RERANK=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_trace_aware_rerank_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
