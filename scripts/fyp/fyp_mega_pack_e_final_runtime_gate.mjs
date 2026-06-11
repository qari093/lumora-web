import fs from "node:fs";

const requiredFiles = [
  ".lumora_fyp_mega_pack_a_production_lock",
  ".lumora_fyp_mega_pack_b_trace_lanes_audit_lock",
  ".lumora_fyp_mega_pack_c_full_audit_lock",
  ".lumora_fyp_mega_pack_d_final_lock",
  "app/fyp/FypAutoplayFeed.tsx",
  "app/fyp/styles.module.css",
  "src/core/fyp/lumoraTrace.ts"
];

const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";

const fyp = read("app/fyp/FypAutoplayFeed.tsx");
const styles = read("app/fyp/styles.module.css");
const trace = read("src/core/fyp/lumoraTrace.ts");

const checks = {
  previousPacksLocked: requiredFiles.slice(0, 4).every((file) => fs.existsSync(file)),
  requiredRuntimeFilesPresent: requiredFiles.slice(4).every((file) => fs.existsSync(file)),
  fullscreenRuntimePresent: fyp.includes("fullscreen-native-autoplay") || fyp.includes("data-fyp-runtime"),
  nativeVideoPreserved: fyp.includes("<video") && fyp.includes("autoPlay") && fyp.includes('preload="auto"'),
  compactCreatorStripPreserved: fyp.includes("creatorStrip"),
  rightRailPreserved: fyp.includes("rightRail") || styles.includes(".rightRail"),
  bottomNavPreserved: fyp.includes("tiktokBottom") || styles.includes("tiktokBottom"),
  traceMemoryExportsPreserved: [
    "LUMORA_LANES",
    "normalizeLane",
    "createTraceSignal",
    "summarizeTrace",
    "shouldOfferStoryContinuation"
  ].every((name) => trace.includes(name)),
  noYoutubeIframeRegression: !fyp.includes("<iframe") && !fyp.includes("youtube.com/embed"),
  cssRuntimeShellPresent: styles.includes("fullscreenVideo") && styles.includes("fullscreenCard")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_E_FINAL_RUNTIME_GATE",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS" ? "MEGA_PACK_E_FINAL_RUNTIME_GATE_READY" : "MEGA_PACK_E_FINAL_RUNTIME_GATE_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-e-final-runtime-gate.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-e-final-runtime-gate.json", JSON.stringify(report, null, 2) + "\n");

fs.writeFileSync(
  "docs/fyp/mega-pack-e-final-runtime-gate.md",
  [
    "# FYP Mega Pack E — Final Runtime Gate",
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
  fs.writeFileSync(".lumora_fyp_mega_pack_e_final_runtime_gate_lock", "FYP_MEGA_PACK_E_FINAL_RUNTIME_GATE=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_e_final_runtime_gate_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_e_final_runtime_gate_failed_lock", "FYP_MEGA_PACK_E_FINAL_RUNTIME_GATE=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_e_final_runtime_gate_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));

if (status !== "PASS") process.exit(1);
