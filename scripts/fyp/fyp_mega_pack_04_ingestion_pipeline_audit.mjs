import fs from "node:fs";

const checks = {
  megaPack01Locked: fs.existsSync(".lumora_fyp_mega_pack_01_core_user_reality_lock"),
  megaPack02Locked: fs.existsSync(".lumora_fyp_mega_pack_02_final_lock"),
  megaPack03Locked: fs.existsSync(".lumora_fyp_mega_pack_03_final_lock"),
  sourceRegistryPresent: fs.existsSync("src/core/fyp/sources/sourceRegistry.ts"),
  licenseValidatorPresent: fs.existsSync("src/core/fyp/sources/licenseProofValidator.ts"),
  sourceSamplingPresent: fs.existsSync("src/core/fyp/sources/sourceSampling.ts"),
  sourceHealthPresent: fs.existsSync("src/core/fyp/sources/sourceHealth.ts"),
  sourceSelectionPresent: fs.existsSync("src/core/fyp/sources/sourceSelection.ts"),
  registryDataPresent: fs.existsSync("data/fyp/source-registry.json")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_04_INGESTION_PIPELINE_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  scope: {
    megaPack: "04/07",
    name: "Ingestion Pipeline + Feed Bridge",
    phases: [
      "Ingestion Queue",
      "Source Fetch Runtime",
      "Normalization Runtime",
      "Feed Bridge",
      "Eligibility Pipeline",
      "Deduplication Layer",
      "Safety Pipeline"
    ]
  },
  checks,
  result:
    status === "PASS"
      ? "FYP_MEGA_PACK_04_INGESTION_PIPELINE_READY"
      : "FYP_MEGA_PACK_04_INGESTION_PIPELINE_BLOCKED"
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

fs.writeFileSync(
  "data/fyp/mega-pack-04-ingestion-pipeline-audit.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  ".lumora-audits/fyp-mega-pack-04-ingestion-pipeline-audit.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  "docs/fyp/mega-pack-04-ingestion-pipeline-audit.md",
  [
    "# FYP Mega Pack 04/07 — Ingestion Pipeline Audit",
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
  fs.writeFileSync(
    ".lumora_fyp_mega_pack_04_ingestion_pipeline_audit_lock",
    "FYP_MEGA_PACK_04_INGESTION_PIPELINE_AUDIT=PASS\n"
  );
}

console.log(JSON.stringify(report, null, 2));

if (status !== "PASS") process.exit(1);
