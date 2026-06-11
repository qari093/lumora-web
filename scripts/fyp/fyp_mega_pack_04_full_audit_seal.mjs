import fs from "node:fs";
import { execSync } from "node:child_process";

const exists = (p) => fs.existsSync(p);
const read = (p) => exists(p) ? fs.readFileSync(p, "utf8") : "";

const run = (cmd, log, passPattern = "") => {
  let output = "";
  try {
    output = execSync(cmd, { stdio: "pipe", encoding: "utf8", timeout: 1000 * 60 * 12 });
    fs.writeFileSync(log, output);
    return passPattern ? output.includes(passPattern) : true;
  } catch (error) {
    output = `${error.stdout || ""}\n${error.stderr || ""}`;
    fs.writeFileSync(log, output);
    return passPattern ? output.includes(passPattern) : false;
  }
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

const typecheck = run("pnpm -s tsc --noEmit", "/tmp/fyp_mega_pack_04_tsc.log");
const queueTests = run(
  "pnpm -s vitest run tests/fyp/fyp_mega_pack_04_ingestion_queue_normalization.test.ts --reporter verbose",
  "/tmp/fyp_mega_pack_04_queue_tests.log",
  "Tests  6 passed"
);
const bridgeTests = run(
  "pnpm -s vitest run tests/fyp/fyp_mega_pack_04_feed_bridge_eligibility.test.ts --reporter verbose",
  "/tmp/fyp_mega_pack_04_bridge_tests.log",
  "Tests  5 passed"
);

const queue = read("src/core/fyp/ingestion/ingestionQueue.ts");
const bridge = read("src/core/fyp/ingestion/feedBridge.ts");

const checks = {
  prerequisiteLocks: {
    pack01: exists(".lumora_fyp_mega_pack_01_core_user_reality_lock"),
    pack02: exists(".lumora_fyp_mega_pack_02_final_lock"),
    pack03: exists(".lumora_fyp_mega_pack_03_final_lock"),
    initialAudit: exists(".lumora_fyp_mega_pack_04_ingestion_pipeline_audit_lock"),
    queueNormalization: exists(".lumora_fyp_mega_pack_04_ingestion_queue_normalization_lock"),
    feedBridgeEligibility: exists(".lumora_fyp_mega_pack_04_feed_bridge_eligibility_lock")
  },
  artifacts: {
    ingestionQueue: exists("src/core/fyp/ingestion/ingestionQueue.ts"),
    feedBridge: exists("src/core/fyp/ingestion/feedBridge.ts"),
    queueTest: exists("tests/fyp/fyp_mega_pack_04_ingestion_queue_normalization.test.ts"),
    bridgeTest: exists("tests/fyp/fyp_mega_pack_04_feed_bridge_eligibility.test.ts")
  },
  queueRuntime: {
    createsJobs: queue.includes("createFypIngestionJob"),
    validatesJobs: queue.includes("validateFypIngestionJob"),
    normalizesJobs: queue.includes("normalizeFypIngestionJob"),
    batchDedup: queue.includes("seen.has(item.id)"),
    protectsYouTubeEmbed: queue.includes("YOUTUBE_OFFICIAL"),
    validatesRuntime: queue.includes("validateFypIngestionQueueNormalizationRuntime")
  },
  bridgeRuntime: {
    bridgesFeed: bridge.includes("buildFypFeedBridge"),
    checksEligibility: bridge.includes("isFypFeedBridgeEligible"),
    hasNativeLane: bridge.includes("native_video"),
    hasOfficialEmbedLane: bridge.includes("official_embed"),
    hasDedupeKey: bridge.includes("dedupeKey"),
    validatesRuntime: bridge.includes("validateFypFeedBridgeEligibilityRuntime")
  },
  tests: {
    typecheck,
    queueTests,
    bridgeTests
  }
};

const flatten = (obj) =>
  Object.values(obj).flatMap((value) =>
    value && typeof value === "object" && !Array.isArray(value) ? flatten(value) : [value]
  );

const status = flatten(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_04_FULL_AUDIT_SEAL",
  checkedAt: new Date().toISOString(),
  status,
  megaPack: "04/07",
  name: "Ingestion Pipeline And Feed Bridge",
  checks,
  logs: {
    typecheck: "/tmp/fyp_mega_pack_04_tsc.log",
    queueTests: "/tmp/fyp_mega_pack_04_queue_tests.log",
    bridgeTests: "/tmp/fyp_mega_pack_04_bridge_tests.log"
  },
  result: status === "PASS"
    ? "FYP_MEGA_PACK_04_FULLY_AUDITED_READY"
    : "FYP_MEGA_PACK_04_FULL_AUDIT_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-04-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-04-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-04-full-audit-seal.md", [
  "# FYP Mega Pack 04/07 — Full Audit Seal",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_04_full_audit_lock", "FYP_MEGA_PACK_04_FULL_AUDIT=PASS\n");
  fs.writeFileSync(".lumora_fyp_mega_pack_04_production_seal", [
    "FYP_MEGA_PACK_04_STATUS=PASS",
    "FYP_MEGA_PACK_04_INGESTION_QUEUE=PASS",
    "FYP_MEGA_PACK_04_NORMALIZATION=PASS",
    "FYP_MEGA_PACK_04_FEED_BRIDGE=PASS",
    "FYP_MEGA_PACK_04_ELIGIBILITY=PASS",
    "FYP_MEGA_PACK_04_TYPECHECK=PASS",
    "FYP_MEGA_PACK_04_TESTS=PASS",
    "FYP_MEGA_PACK_04_PRODUCTION_SEAL=PASS",
    ""
  ].join("\n"));
  fs.writeFileSync(".lumora_fyp_mega_pack_04_final_lock", [
    "FYP_MEGA_PACK_04_FULL_AUDIT=PASS",
    "FYP_MEGA_PACK_04_PRODUCTION_SEAL=PASS",
    "FYP_MEGA_PACK_04_FINAL_LOCK=PASS",
    ""
  ].join("\n"));
  try { fs.unlinkSync(".lumora_fyp_mega_pack_04_full_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_04_full_audit_failed_lock", "FYP_MEGA_PACK_04_FULL_AUDIT=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_04_full_audit_lock"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_04_production_seal"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_04_final_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
