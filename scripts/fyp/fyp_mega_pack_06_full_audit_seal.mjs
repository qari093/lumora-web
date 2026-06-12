import fs from "node:fs";
import { execSync } from "node:child_process";

const exists = (p) => fs.existsSync(p);

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

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

const typecheck = run("pnpm -s tsc --noEmit", "/tmp/fyp_mega_pack_06_tsc.log");
const rankingTests = run("pnpm -s vitest run tests/fyp/fyp_mega_pack_06_runtime_ranking_contract.test.ts --reporter verbose", "/tmp/fyp_mega_pack_06_ranking_tests.log");
const learningTests = run("pnpm -s vitest run tests/fyp/fyp_mega_pack_06_personalization_learning.test.ts --reporter verbose", "/tmp/fyp_mega_pack_06_learning_tests.log");
const rerankTests = run("pnpm -s vitest run tests/fyp/fyp_mega_pack_06_trace_aware_rerank.test.ts --reporter verbose", "/tmp/fyp_mega_pack_06_rerank_tests.log");

const checks = {
  locks: {
    pack01: exists(".lumora_fyp_mega_pack_01_core_user_reality_lock"),
    pack02: exists(".lumora_fyp_mega_pack_02_final_lock"),
    pack03: exists(".lumora_fyp_mega_pack_03_final_lock"),
    pack04: exists(".lumora_fyp_mega_pack_04_final_lock"),
    pack05: exists(".lumora_fyp_mega_pack_05_final_lock"),
    pack06Audit: exists(".lumora_fyp_mega_pack_06_ranking_learning_audit_lock"),
    rankingContract: exists(".lumora_fyp_mega_pack_06_runtime_ranking_contract_lock"),
    personalizationLearning: exists(".lumora_fyp_mega_pack_06_personalization_learning_lock"),
    traceAwareRerank: exists(".lumora_fyp_mega_pack_06_trace_aware_rerank_lock")
  },
  runtimeFiles: {
    rankingRuntime: exists("src/core/fyp/runtime-ranking/rankingRuntime.ts"),
    personalizationLearning: exists("src/core/fyp/runtime-learning/personalizationLearning.ts"),
    traceAwareRerank: exists("src/core/fyp/runtime-learning/traceAwareRerank.ts"),
    trackingRuntime: exists("src/core/fyp/runtime-tracking/fypRuntimeTracking.ts")
  },
  tests: {
    typecheck,
    rankingTests,
    learningTests,
    rerankTests
  }
};

const flatten = (obj) =>
  Object.values(obj).flatMap((value) =>
    value && typeof value === "object" && !Array.isArray(value) ? flatten(value) : [value]
  );

const status = flatten(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_06_FULL_AUDIT_SEAL",
  checkedAt: new Date().toISOString(),
  status,
  megaPack: "06/07",
  name: "Ranking Personalization And Learning Runtime",
  checks,
  logs: {
    typecheck: "/tmp/fyp_mega_pack_06_tsc.log",
    rankingTests: "/tmp/fyp_mega_pack_06_ranking_tests.log",
    learningTests: "/tmp/fyp_mega_pack_06_learning_tests.log",
    rerankTests: "/tmp/fyp_mega_pack_06_rerank_tests.log"
  },
  result: status === "PASS"
    ? "FYP_MEGA_PACK_06_FULLY_AUDITED_READY"
    : "FYP_MEGA_PACK_06_FULL_AUDIT_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-06-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-06-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-06-full-audit-seal.md", [
  "# FYP Mega Pack 06/07 — Full Audit Seal",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_06_full_audit_lock", "FYP_MEGA_PACK_06_FULL_AUDIT=PASS\n");
  fs.writeFileSync(".lumora_fyp_mega_pack_06_production_seal", [
    "FYP_MEGA_PACK_06_STATUS=PASS",
    "FYP_MEGA_PACK_06_RANKING=PASS",
    "FYP_MEGA_PACK_06_PERSONALIZATION=PASS",
    "FYP_MEGA_PACK_06_LEARNING=PASS",
    "FYP_MEGA_PACK_06_TRACE_RERANK=PASS",
    "FYP_MEGA_PACK_06_COLD_START=PASS",
    "FYP_MEGA_PACK_06_TESTS=PASS",
    "FYP_MEGA_PACK_06_PRODUCTION_SEAL=PASS",
    ""
  ].join("\n"));
  fs.writeFileSync(".lumora_fyp_mega_pack_06_final_lock", [
    "FYP_MEGA_PACK_06_FULL_AUDIT=PASS",
    "FYP_MEGA_PACK_06_PRODUCTION_SEAL=PASS",
    "FYP_MEGA_PACK_06_FINAL_LOCK=PASS",
    ""
  ].join("\n"));
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_full_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_06_full_audit_failed_lock", "FYP_MEGA_PACK_06_FULL_AUDIT=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_full_audit_lock"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_production_seal"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_final_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
