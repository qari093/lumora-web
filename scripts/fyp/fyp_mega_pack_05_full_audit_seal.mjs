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

const typecheck = run("pnpm -s tsc --noEmit", "/tmp/fyp_mega_pack_05_tsc.log");
const feedApiTests = run("pnpm -s vitest run tests/fyp/fyp_mega_pack_05_feed_api_bridge_runtime.test.ts --reporter verbose", "/tmp/fyp_mega_pack_05_feed_api_tests.log");
const adapterTests = run("pnpm -s vitest run tests/fyp/fyp_mega_pack_05_real_feed_adapter.test.ts --reporter verbose", "/tmp/fyp_mega_pack_05_adapter_tests.log");
const uiTests = run("pnpm -s vitest run tests/fyp/fyp_mega_pack_05_ui_runtime_wiring.test.ts --reporter verbose", "/tmp/fyp_mega_pack_05_ui_tests.log");
const trackingTests = run("pnpm -s vitest run tests/fyp/fyp_mega_pack_05_tracking_api_integration.test.ts --reporter verbose", "/tmp/fyp_mega_pack_05_tracking_tests.log");

const checks = {
  locks: {
    pack01: exists(".lumora_fyp_mega_pack_01_core_user_reality_lock"),
    pack02: exists(".lumora_fyp_mega_pack_02_final_lock"),
    pack03: exists(".lumora_fyp_mega_pack_03_final_lock"),
    pack04: exists(".lumora_fyp_mega_pack_04_final_lock"),
    pack05Audit: exists(".lumora_fyp_mega_pack_05_runtime_api_feed_wiring_audit_lock"),
    uiRuntime: exists(".lumora_fyp_mega_pack_05_ui_runtime_wiring_lock"),
    tracking: exists(".lumora_fyp_mega_pack_05_tracking_api_integration_lock")
  },
  runtimeFiles: {
    feedApiBridge: exists("src/core/fyp/runtime-api/feedApiBridge.ts"),
    realFeedAdapter: exists("src/core/fyp/runtime-adapter/realFeedAdapter.ts"),
    uiRuntime: exists("src/core/fyp/runtime-ui/fypRuntimeUi.ts"),
    trackingRuntime: exists("src/core/fyp/runtime-tracking/fypRuntimeTracking.ts")
  },
  tests: {
    typecheck,
    feedApiTests,
    adapterTests,
    uiTests,
    trackingTests
  }
};

const flatten = (obj) =>
  Object.values(obj).flatMap((value) =>
    value && typeof value === "object" && !Array.isArray(value) ? flatten(value) : [value]
  );

const status = flatten(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_05_FULL_AUDIT_SEAL",
  checkedAt: new Date().toISOString(),
  status,
  megaPack: "05/07",
  name: "Runtime API Integration And Real Feed Wiring",
  checks,
  logs: {
    typecheck: "/tmp/fyp_mega_pack_05_tsc.log",
    feedApiTests: "/tmp/fyp_mega_pack_05_feed_api_tests.log",
    adapterTests: "/tmp/fyp_mega_pack_05_adapter_tests.log",
    uiTests: "/tmp/fyp_mega_pack_05_ui_tests.log",
    trackingTests: "/tmp/fyp_mega_pack_05_tracking_tests.log"
  },
  result: status === "PASS"
    ? "FYP_MEGA_PACK_05_FULLY_AUDITED_READY"
    : "FYP_MEGA_PACK_05_FULL_AUDIT_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-05-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-05-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-05-full-audit-seal.md", [
  "# FYP Mega Pack 05/07 — Full Audit Seal",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_05_full_audit_lock", "FYP_MEGA_PACK_05_FULL_AUDIT=PASS\n");
  fs.writeFileSync(".lumora_fyp_mega_pack_05_production_seal", [
    "FYP_MEGA_PACK_05_STATUS=PASS",
    "FYP_MEGA_PACK_05_RUNTIME_API=PASS",
    "FYP_MEGA_PACK_05_REAL_FEED_ADAPTER=PASS",
    "FYP_MEGA_PACK_05_UI_WIRING=PASS",
    "FYP_MEGA_PACK_05_TRACKING=PASS",
    "FYP_MEGA_PACK_05_TESTS=PASS",
    "FYP_MEGA_PACK_05_PRODUCTION_SEAL=PASS",
    ""
  ].join("\n"));
  fs.writeFileSync(".lumora_fyp_mega_pack_05_final_lock", [
    "FYP_MEGA_PACK_05_FULL_AUDIT=PASS",
    "FYP_MEGA_PACK_05_PRODUCTION_SEAL=PASS",
    "FYP_MEGA_PACK_05_FINAL_LOCK=PASS",
    ""
  ].join("\n"));
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_full_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_05_full_audit_failed_lock", "FYP_MEGA_PACK_05_FULL_AUDIT=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_full_audit_lock"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_production_seal"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_05_final_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
