import fs from "node:fs";
import { execSync } from "node:child_process";

const exists = (file) => fs.existsSync(file);
const read = (file) => exists(file) ? fs.readFileSync(file, "utf8") : "";
const run = (cmd, log) => {
  try {
    const out = execSync(cmd, { encoding: "utf8", stdio: "pipe" });
    fs.writeFileSync(log, out);
    return true;
  } catch (error) {
    fs.writeFileSync(log, `${error.stdout || ""}\n${error.stderr || ""}`);
    return false;
  }
};

const logs = {
  typecheck: "/tmp/fyp_mega_pack_e_tsc.log",
  gate: "/tmp/fyp_mega_pack_e_gate.log",
  build: "/tmp/fyp_mega_pack_e_build.log"
};

const typecheck = run("pnpm -s tsc --noEmit", logs.typecheck);
const gate = run("node scripts/fyp/fyp_mega_pack_e_final_runtime_gate.mjs", logs.gate);
const build = run("pnpm -s next build", logs.build);

const fyp = read("app/fyp/FypAutoplayFeed.tsx");
const styles = read("app/fyp/styles.module.css");
const trace = read("src/core/fyp/lumoraTrace.ts");

const checks = {
  typecheck,
  gate,
  build,
  locks: {
    packA: exists(".lumora_fyp_mega_pack_a_production_lock"),
    packB: exists(".lumora_fyp_mega_pack_b_trace_lanes_audit_lock"),
    packC: exists(".lumora_fyp_mega_pack_c_full_audit_lock"),
    packD: exists(".lumora_fyp_mega_pack_d_final_lock"),
    packE: exists(".lumora_fyp_mega_pack_e_final_runtime_gate_lock")
  },
  runtime: {
    fullscreenNativeAutoplay: fyp.includes("fullscreen-native-autoplay") || fyp.includes("data-fyp-runtime"),
    nativeVideo: fyp.includes("<video") && fyp.includes("autoPlay"),
    preloadAuto: fyp.includes('preload="auto"'),
    compactCreatorStrip: fyp.includes("creatorStrip"),
    rightRail: fyp.includes("rightRail") || styles.includes(".rightRail"),
    bottomNav: fyp.includes("tiktokBottom") || styles.includes("tiktokBottom"),
    noYoutubeIframe: !fyp.includes("<iframe") && !fyp.includes("youtube.com/embed")
  },
  traceExports: {
    lanes: trace.includes("LUMORA_LANES"),
    normalizeLane: trace.includes("normalizeLane"),
    createTraceSignal: trace.includes("createTraceSignal"),
    summarizeTrace: trace.includes("summarizeTrace"),
    storyContinuation: trace.includes("shouldOfferStoryContinuation")
  }
};

const status =
  checks.typecheck &&
  checks.gate &&
  checks.build &&
  Object.values(checks.locks).every(Boolean) &&
  Object.values(checks.runtime).every(Boolean) &&
  Object.values(checks.traceExports).every(Boolean)
    ? "PASS"
    : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_E_FULL_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  logs,
  result: status === "PASS" ? "MEGA_PACK_E_FULLY_AUDITED_READY" : "MEGA_PACK_E_FULL_AUDIT_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-e-full-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-e-full-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(
  "docs/fyp/mega-pack-e-full-audit.md",
  [
    "# FYP Mega Pack E — Full Audit",
    "",
    `Status: ${status}`,
    "",
    "```json",
    JSON.stringify(report, null, 2),
    "```",
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_e_full_audit_lock", "FYP_MEGA_PACK_E_FULL_AUDIT=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_e_full_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_e_full_audit_failed_lock", "FYP_MEGA_PACK_E_FULL_AUDIT=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_e_full_audit_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
