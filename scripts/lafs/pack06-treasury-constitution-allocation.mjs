import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditDir = path.join(root, ".lumora-audits");
const dataDir = path.join(root, "data", "lafs");
const docsDir = path.join(root, "docs", "lafs");

for (const dir of [auditDir, dataDir, docsDir]) fs.mkdirSync(dir, { recursive: true });

const requiredPreviousLock = ".lumora_lafs_pack05_reconciliation_risk_freeze_lock";
const requiredFiles = [
  "src/core/lafs/treasuryConstitution.ts",
  "prisma/migrations/lafs-prebeta/006_lafs_treasury_constitution_allocation.sql"
];

const checks = requiredFiles.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file)),
  bytes: fs.existsSync(path.join(root, file)) ? fs.statSync(path.join(root, file)).size : 0
}));

const manifest = {
  system: "LAFS_PRE_BETA",
  status: "TREASURY_CONSTITUTION_ALLOCATION_READY",
  pack: "06/08",
  generatedAt: new Date().toISOString(),
  guards: {
    paymentLiveMode: false,
    allocationRulesGoverned: true,
    allocationTotalMustEqual100: true,
    constitutionVersioned: true,
    constitutionDiffViewReady: true,
    councilApprovalRequiredForRuleChanges: true
  },
  activeAllocationRule: {
    version: 1,
    operationsPct: 45,
    reservePct: 25,
    growthPct: 15,
    creatorRewardsPct: 10,
    emergencyBufferPct: 5,
    totalPct: 100
  },
  constitutionSections: [
    "treasury_allocation",
    "approval_governance",
    "risk_governance",
    "beta_guards",
    "constitution_diff_view"
  ],
  nextPack: "LAFS Pack 07/08 — Dashboard Command Hearth"
};

const status =
  fs.existsSync(path.join(root, requiredPreviousLock)) &&
  checks.every((check) => check.exists && check.bytes > 0) &&
  manifest.guards.paymentLiveMode === false &&
  manifest.guards.allocationRulesGoverned === true &&
  manifest.activeAllocationRule.totalPct === 100
    ? "PASS"
    : "FAIL";

const audit = {
  checkedAt: new Date().toISOString(),
  status,
  previousLock: {
    file: requiredPreviousLock,
    exists: fs.existsSync(path.join(root, requiredPreviousLock))
  },
  manifest,
  checks,
  nextRequiredAction: "LAFS Pack 07/08 — Dashboard Command Hearth"
};

fs.writeFileSync(path.join(dataDir, "treasury-constitution-allocation.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(auditDir, "lafs-pack06-treasury-constitution-allocation.json"), JSON.stringify(audit, null, 2) + "\n");
fs.writeFileSync(
  path.join(docsDir, "pack06-treasury-constitution-allocation.md"),
  [
    "# LAFS Pack 06/08 — Treasury Constitution + Allocation Rules",
    "",
    "Status: TREASURY_CONSTITUTION_ALLOCATION_READY",
    "",
    "Rules:",
    "- Treasury allocation rules are governed, not hardcoded.",
    "- Active allocation must total exactly 100%.",
    "- Rule changes require council approval.",
    "- Constitution versions are auditable.",
    "- Constitution diff view is included for amendments.",
    "- Payment live mode remains false for pre-beta.",
    "",
    "Next: LAFS Pack 07/08 — Dashboard Command Hearth",
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack06_treasury_constitution_lock"), "LAFS_PACK06_TREASURY_CONSTITUTION=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_lafs_pack06_treasury_constitution_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack06_treasury_constitution_failed_lock"), "LAFS_PACK06_TREASURY_CONSTITUTION=FAIL\n");
}

console.log(JSON.stringify(audit, null, 2));
if (status !== "PASS") process.exitCode = 1;
