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

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

const typecheck = run("pnpm -s tsc --noEmit", "/tmp/fyp_mega_pack_03_tsc.log");
const healthTests = run(
  "pnpm -s vitest run tests/fyp/fyp_mega_pack_03_source_health_runtime.test.ts --reporter verbose",
  "/tmp/fyp_mega_pack_03_health_tests.log"
);
const selectionTests = run(
  "pnpm -s vitest run tests/fyp/fyp_mega_pack_03_source_selection_failover.test.ts --reporter verbose",
  "/tmp/fyp_mega_pack_03_selection_tests.log"
);

const health = read("src/core/fyp/sources/sourceHealth.ts");
const selection = read("src/core/fyp/sources/sourceSelection.ts");

const checks = {
  prerequisiteLocks: {
    pack01: exists(".lumora_fyp_mega_pack_01_core_user_reality_lock"),
    pack02: exists(".lumora_fyp_mega_pack_02_final_lock"),
    initialAudit: exists(".lumora_fyp_mega_pack_03_source_infrastructure_audit_lock"),
    sourceHealth: exists(".lumora_fyp_mega_pack_03_source_health_runtime_lock"),
    sourceSelectionFailover: exists(".lumora_fyp_mega_pack_03_source_selection_failover_lock")
  },
  artifacts: {
    registry: exists("src/core/fyp/sources/sourceRegistry.ts"),
    licenseValidator: exists("src/core/fyp/sources/licenseProofValidator.ts"),
    sampling: exists("src/core/fyp/sources/sourceSampling.ts"),
    healthRuntime: exists("src/core/fyp/sources/sourceHealth.ts"),
    selectionRuntime: exists("src/core/fyp/sources/sourceSelection.ts"),
    registryData: exists("data/fyp/source-registry.json")
  },
  healthRuntime: {
    validatesAll48: health.includes("snapshots.length === 48"),
    summarizesHealth: health.includes("summarizeFypSourceHealth"),
    blocksBadPolicy: health.includes("policy_guard_failed"),
    validatorPresent: health.includes("validateFypSourceHealthRuntime")
  },
  selectionFailover: {
    selectorPresent: selection.includes("selectFypSources"),
    scoringPresent: selection.includes("scoreSource"),
    categoryScopedSelection: selection.includes("category?: FypSourceCategory"),
    embedPreference: selection.includes("preferEmbedOnly"),
    failoverChain: selection.includes("getFypSourceFailoverChain"),
    validatorPresent: selection.includes("validateFypSourceSelectionFailoverRuntime")
  },
  tests: {
    typecheck,
    healthTests,
    selectionTests
  }
};

const flatten = (obj) =>
  Object.values(obj).flatMap((value) =>
    value && typeof value === "object" && !Array.isArray(value) ? flatten(value) : [value]
  );

const status = flatten(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_03_FULL_AUDIT_SEAL",
  checkedAt: new Date().toISOString(),
  status,
  megaPack: "03/07",
  name: "Source Infrastructure",
  checks,
  logs: {
    typecheck: "/tmp/fyp_mega_pack_03_tsc.log",
    healthTests: "/tmp/fyp_mega_pack_03_health_tests.log",
    selectionTests: "/tmp/fyp_mega_pack_03_selection_tests.log"
  },
  result: status === "PASS"
    ? "FYP_MEGA_PACK_03_FULLY_AUDITED_READY"
    : "FYP_MEGA_PACK_03_FULL_AUDIT_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-03-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-03-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-03-full-audit-seal.md", [
  "# FYP Mega Pack 03/07 — Full Audit Seal",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_03_full_audit_lock", "FYP_MEGA_PACK_03_FULL_AUDIT=PASS\n");
  fs.writeFileSync(".lumora_fyp_mega_pack_03_production_seal", [
    "FYP_MEGA_PACK_03_STATUS=PASS",
    "FYP_MEGA_PACK_03_SOURCE_INFRASTRUCTURE=PASS",
    "FYP_MEGA_PACK_03_SOURCE_HEALTH=PASS",
    "FYP_MEGA_PACK_03_SOURCE_SELECTION=PASS",
    "FYP_MEGA_PACK_03_FAILOVER=PASS",
    "FYP_MEGA_PACK_03_TYPECHECK=PASS",
    "FYP_MEGA_PACK_03_TESTS=PASS",
    "FYP_MEGA_PACK_03_PRODUCTION_SEAL=PASS",
    ""
  ].join("\n"));
  fs.writeFileSync(".lumora_fyp_mega_pack_03_final_lock", [
    "FYP_MEGA_PACK_03_FULL_AUDIT=PASS",
    "FYP_MEGA_PACK_03_PRODUCTION_SEAL=PASS",
    "FYP_MEGA_PACK_03_FINAL_LOCK=PASS",
    ""
  ].join("\n"));
  try { fs.unlinkSync(".lumora_fyp_mega_pack_03_full_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_03_full_audit_failed_lock", "FYP_MEGA_PACK_03_FULL_AUDIT=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_03_full_audit_lock"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_03_production_seal"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_03_final_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
