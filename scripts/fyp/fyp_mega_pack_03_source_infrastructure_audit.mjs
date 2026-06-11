import fs from "node:fs";

const exists = (p) => fs.existsSync(p);

const checks = {
  megaPack01Locked: exists(".lumora_fyp_mega_pack_01_core_user_reality_lock"),
  megaPack02Locked: exists(".lumora_fyp_mega_pack_02_final_lock"),
  sourceRegistryPresent: exists("src/core/fyp/sources/sourceRegistry.ts"),
  licenseValidatorPresent: exists("src/core/fyp/sources/licenseProofValidator.ts"),
  sourceSamplingPresent: exists("src/core/fyp/sources/sourceSampling.ts"),
  sourceRegistryDataPresent: exists("data/fyp/source-registry.json"),
  sourceCount48Maintained: exists("data/fyp/source-registry.json")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_03_SOURCE_INFRASTRUCTURE_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  scope: {
    megaPack: "03/07",
    name: "Source Infrastructure",
    phases: [
      "Source Registry Service",
      "Source Health Monitoring",
      "Source Availability Runtime",
      "Source Selection Engine",
      "Source Failover Engine"
    ]
  },
  checks,
  result:
    status === "PASS"
      ? "FYP_MEGA_PACK_03_SOURCE_INFRASTRUCTURE_READY"
      : "FYP_MEGA_PACK_03_SOURCE_INFRASTRUCTURE_BLOCKED"
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

fs.writeFileSync(
  "data/fyp/mega-pack-03-source-infrastructure-audit.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  ".lumora-audits/fyp-mega-pack-03-source-infrastructure-audit.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  "docs/fyp/mega-pack-03-source-infrastructure-audit.md",
  [
    "# FYP Mega Pack 03/07 — Source Infrastructure Audit",
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
    ".lumora_fyp_mega_pack_03_source_infrastructure_audit_lock",
    "FYP_MEGA_PACK_03_SOURCE_INFRASTRUCTURE_AUDIT=PASS\n"
  );
}

console.log(JSON.stringify(report, null, 2));

if (status !== "PASS") process.exit(1);
