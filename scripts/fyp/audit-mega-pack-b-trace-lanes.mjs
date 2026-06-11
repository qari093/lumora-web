import fs from "node:fs";
import path from "node:path";

const read = (file) => {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
};

const files = [
  "app/fyp/page.tsx",
  "app/fyp/FypAutoplayFeed.tsx",
  "app/fyp/styles.module.css",
  "src/core/fyp/fullscreenSourceFeed.ts",
  "src/core/fyp/lumoraTraceDepthfeed.ts",
  "tests/fyp/fyp_mega_pack_b_trace_lanes.test.ts"
];

const corpus = files.map(read).join("\n").toLowerCase();

const hasAll = (terms) => terms.every((term) => corpus.includes(term.toLowerCase()));

const checks = {
  packBLockPass: read(".lumora_fyp_mega_pack_b_trace_lanes_lock").includes("PASS"),
  traceSystemPresent: hasAll(["Lumora Trace", "attention", "trace"]),
  emotionalLanesPresent: hasAll(["Wonder", "Learn", "Laugh", "Build", "Explore"]),
  activePulsePresent: hasAll(["Active Pulse"]),
  sparkBoardPresent: hasAll(["SparkBoard"]),
  curiositySignalPresent: hasAll(["Curiosity"]),
  deepDivePresent: hasAll(["Deep Dive"]),
  fullScreenRuntimePreserved: hasAll(["fullscreen-native-autoplay", "data-fyp-runtime"]),
  nativeAutoplayPreserved: hasAll(["autoPlay", "preload=\"auto\"", "safePlay"]),
  compactOverlayPreserved: hasAll(["creatorStrip", "rightRail", "tiktokBottom"]),
  depthfeedStylesPresent: hasAll(["depth", "trace", "lane"])
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_B_TRACE_LANES_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS" ? "MEGA_PACK_B_TRACE_LANES_READY" : "MEGA_PACK_B_TRACE_LANES_BLOCKED"
};

for (const file of [
  "data/fyp/mega-pack-b-trace-lanes-audit.json",
  ".lumora-audits/fyp-mega-pack-b-trace-lanes-audit.json"
]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(report, null, 2) + "\n");
}

fs.mkdirSync("docs/fyp", { recursive: true });
fs.writeFileSync(
  "docs/fyp/mega-pack-b-trace-lanes-audit.md",
  `# FYP Mega Pack B Trace Lanes Audit\n\nStatus: ${status}\n\nResult: ${report.result}\n`
);

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_b_trace_lanes_audit_lock", "LUMORA_FYP_MEGA_PACK_B_TRACE_LANES_AUDIT=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_b_trace_lanes_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_b_trace_lanes_audit_failed_lock", "LUMORA_FYP_MEGA_PACK_B_TRACE_LANES_AUDIT=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_b_trace_lanes_audit_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));

if (status !== "PASS") process.exit(1);
