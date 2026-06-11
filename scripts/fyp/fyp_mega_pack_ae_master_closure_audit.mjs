import fs from "node:fs";

const requiredLocks = {
  packA: ".lumora_fyp_mega_pack_a_production_lock",
  packB: ".lumora_fyp_mega_pack_b_trace_lanes_audit_lock",
  packC: ".lumora_fyp_mega_pack_c_full_audit_lock",
  packD: ".lumora_fyp_mega_pack_d_final_lock",
  packE: ".lumora_fyp_mega_pack_e_final_lock"
};

const requiredArtifacts = [
  "app/fyp/FypAutoplayFeed.tsx",
  "app/fyp/styles.module.css",
  "src/core/fyp/lumoraTrace.ts",
  "data/fyp/mega-pack-e-full-audit.json",
  "docs/fyp/mega-pack-e-full-audit.md"
];

const read = file => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";

const fyp = read("app/fyp/FypAutoplayFeed.tsx");
const styles = read("app/fyp/styles.module.css");
const trace = read("src/core/fyp/lumoraTrace.ts");

const checks = {
  locks: Object.fromEntries(
    Object.entries(requiredLocks).map(([key, file]) => [key, fs.existsSync(file)])
  ),
  artifactsPresent: requiredArtifacts.every(file => fs.existsSync(file)),
  runtime: {
    fullscreenNativeAutoplay: fyp.includes("fullscreen-native-autoplay") || fyp.includes("data-fyp-runtime"),
    nativeVideo: fyp.includes("<video") && fyp.includes("autoPlay"),
    preloadAuto: fyp.includes('preload="auto"') || fyp.includes("preload=\"auto\""),
    compactCreatorStrip: fyp.includes("creatorStrip"),
    rightRail: fyp.includes("rightRail") || styles.includes("rightRail"),
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
  Object.values(checks.locks).every(Boolean) &&
  checks.artifactsPresent &&
  Object.values(checks.runtime).every(Boolean) &&
  Object.values(checks.traceExports).every(Boolean)
    ? "PASS"
    : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_AE_MASTER_CLOSURE_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_AE_MASTER_CLOSURE_READY"
    : "FYP_MEGA_PACK_AE_MASTER_CLOSURE_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-ae-master-closure-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-ae-master-closure-audit.json", JSON.stringify(report, null, 2) + "\n");

fs.writeFileSync(
  "docs/fyp/mega-pack-ae-master-closure-audit.md",
  [
    "# FYP Mega Pack A–E — Master Closure Audit",
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
  fs.writeFileSync(".lumora_fyp_mega_pack_ae_master_closure_lock", "FYP_MEGA_PACK_AE_MASTER_CLOSURE=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_ae_master_closure_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_ae_master_closure_failed_lock", "FYP_MEGA_PACK_AE_MASTER_CLOSURE=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_ae_master_closure_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));

if (status !== "PASS") process.exit(1);
