import fs from "node:fs";

const exists = (p) => fs.existsSync(p);

const checks = {
  megaPack01Locked: exists(".lumora_fyp_mega_pack_01_core_user_reality_lock"),
  megaPack02Locked: exists(".lumora_fyp_mega_pack_02_final_lock"),
  megaPack03Locked: exists(".lumora_fyp_mega_pack_03_final_lock"),
  megaPack04Locked: exists(".lumora_fyp_mega_pack_04_final_lock"),
  megaPack05Locked: exists(".lumora_fyp_mega_pack_05_final_lock"),
  feedApiBridgePresent: exists("src/core/fyp/runtime-api/feedApiBridge.ts"),
  realFeedAdapterPresent: exists("src/core/fyp/runtime-adapter/realFeedAdapter.ts"),
  uiRuntimePresent: exists("src/core/fyp/runtime-ui/fypRuntimeUi.ts"),
  trackingRuntimePresent: exists("src/core/fyp/runtime-tracking/fypRuntimeTracking.ts"),
  traceCorePresent: exists("src/core/fyp/lumoraTrace.ts")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_06_RANKING_LEARNING_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  scope: {
    megaPack: "06/07",
    name: "Ranking + Personalization + Learning Runtime",
    phases: [
      "Runtime Ranking Contract",
      "Tracking Signal Scoring",
      "Personalization Memory Adapter",
      "Learning Feedback Loop",
      "Trace-Aware Feed Rerank",
      "Cold Start Safety",
      "Ranking Runtime Validation"
    ]
  },
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_06_RANKING_LEARNING_READY"
    : "FYP_MEGA_PACK_06_RANKING_LEARNING_BLOCKED"
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

fs.writeFileSync("data/fyp/mega-pack-06-ranking-learning-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-06-ranking-learning-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-06-ranking-learning-audit.md", [
  "# FYP Mega Pack 06/07 — Ranking + Personalization + Learning Runtime Audit",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_06_ranking_learning_audit_lock", "FYP_MEGA_PACK_06_RANKING_LEARNING_AUDIT=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_ranking_learning_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_06_ranking_learning_audit_failed_lock", "FYP_MEGA_PACK_06_RANKING_LEARNING_AUDIT=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_06_ranking_learning_audit_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
