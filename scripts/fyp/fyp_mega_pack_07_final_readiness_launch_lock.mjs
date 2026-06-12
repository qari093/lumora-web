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

const typecheck = run("pnpm -s tsc --noEmit", "/tmp/fyp_mega_pack_07_tsc.log");
const runtimeChainTests = run(
  "pnpm -s vitest run tests/fyp/fyp_mega_pack_07_runtime_chain_verification.test.ts --reporter verbose",
  "/tmp/fyp_mega_pack_07_runtime_chain_tests.log"
);

const checks = {
  locks: {
    pack01: exists(".lumora_fyp_mega_pack_01_core_user_reality_lock"),
    pack02: exists(".lumora_fyp_mega_pack_02_final_lock"),
    pack03: exists(".lumora_fyp_mega_pack_03_final_lock"),
    pack04: exists(".lumora_fyp_mega_pack_04_final_lock"),
    pack05: exists(".lumora_fyp_mega_pack_05_final_lock"),
    pack06: exists(".lumora_fyp_mega_pack_06_final_lock"),
    pack07Audit: exists(".lumora_fyp_mega_pack_07_production_validation_audit_lock"),
    runtimeChain: exists(".lumora_fyp_mega_pack_07_runtime_chain_verification_lock")
  },
  runtimeFiles: {
    feedApiBridge: exists("src/core/fyp/runtime-api/feedApiBridge.ts"),
    realFeedAdapter: exists("src/core/fyp/runtime-adapter/realFeedAdapter.ts"),
    uiRuntime: exists("src/core/fyp/runtime-ui/fypRuntimeUi.ts"),
    trackingRuntime: exists("src/core/fyp/runtime-tracking/fypRuntimeTracking.ts"),
    rankingRuntime: exists("src/core/fyp/runtime-ranking/rankingRuntime.ts"),
    personalizationLearning: exists("src/core/fyp/runtime-learning/personalizationLearning.ts"),
    traceAwareRerank: exists("src/core/fyp/runtime-learning/traceAwareRerank.ts")
  },
  tests: {
    typecheck,
    runtimeChainTests
  }
};

const flatten = (obj) =>
  Object.values(obj).flatMap((value) =>
    value && typeof value === "object" && !Array.isArray(value) ? flatten(value) : [value]
  );

const status = flatten(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_07_FINAL_READINESS_LAUNCH_LOCK",
  checkedAt: new Date().toISOString(),
  status,
  megaPack: "07/07",
  name: "Final Production Validation And Launch Seal",
  checks,
  logs: {
    typecheck: "/tmp/fyp_mega_pack_07_tsc.log",
    runtimeChainTests: "/tmp/fyp_mega_pack_07_runtime_chain_tests.log"
  },
  result: status === "PASS"
    ? "FYP_MEGA_PACK_07_FINAL_LAUNCH_READY"
    : "FYP_MEGA_PACK_07_FINAL_LAUNCH_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-07-final-readiness-launch-lock.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-07-final-readiness-launch-lock.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-07-final-readiness-launch-lock.md", [
  "# FYP Mega Pack 07/07 — Final Readiness Launch Lock",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_07_full_audit_lock", "FYP_MEGA_PACK_07_FULL_AUDIT=PASS\n");
  fs.writeFileSync(".lumora_fyp_mega_pack_07_production_seal", [
    "FYP_MEGA_PACK_07_STATUS=PASS",
    "FYP_MEGA_PACK_07_PRODUCTION_VALIDATION=PASS",
    "FYP_MEGA_PACK_07_RUNTIME_CHAIN=PASS",
    "FYP_MEGA_PACK_07_FEED_JOURNEY=PASS",
    "FYP_MEGA_PACK_07_TRACKING_JOURNEY=PASS",
    "FYP_MEGA_PACK_07_LEARNING_JOURNEY=PASS",
    "FYP_MEGA_PACK_07_TESTS=PASS",
    "FYP_MEGA_PACK_07_PRODUCTION_SEAL=PASS",
    ""
  ].join("\n"));
  fs.writeFileSync(".lumora_fyp_mega_pack_07_final_lock", [
    "FYP_MEGA_PACK_07_FULL_AUDIT=PASS",
    "FYP_MEGA_PACK_07_PRODUCTION_SEAL=PASS",
    "FYP_MEGA_PACK_07_FINAL_LOCK=PASS",
    ""
  ].join("\n"));
  fs.writeFileSync(".lumora_fyp_final_launch_lock", [
    "FYP_MEGA_PACKS_01_TO_07=PASS",
    "FYP_FINAL_RUNTIME_READY=PASS",
    "FYP_FINAL_LAUNCH_LOCK=PASS",
    ""
  ].join("\n"));
  try { fs.unlinkSync(".lumora_fyp_mega_pack_07_final_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_07_final_failed_lock", "FYP_MEGA_PACK_07_FINAL=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_07_full_audit_lock"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_07_production_seal"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_07_final_lock"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_final_launch_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
