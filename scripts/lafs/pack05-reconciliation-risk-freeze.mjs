import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditDir = path.join(root, ".lumora-audits");
const dataDir = path.join(root, "data", "lafs");
const docsDir = path.join(root, "docs", "lafs");

for (const dir of [auditDir, dataDir, docsDir]) fs.mkdirSync(dir, { recursive: true });

const requiredPreviousLock = ".lumora_lafs_pack04_approval_rbac_lock";
const requiredFiles = [
  "src/core/lafs/reconciliationRisk.ts",
  "prisma/migrations/lafs-prebeta/005_lafs_reconciliation_risk_freeze.sql"
];

const checks = requiredFiles.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file)),
  bytes: fs.existsSync(path.join(root, file)) ? fs.statSync(path.join(root, file)).size : 0
}));

const manifest = {
  system: "LAFS_PRE_BETA",
  status: "RECONCILIATION_RISK_FREEZE_READY",
  pack: "05/08",
  generatedAt: new Date().toISOString(),
  guards: {
    paymentLiveMode: false,
    reconciliationRequiredBeforePayouts: true,
    highRiskFreezesAffectedSource: true,
    criticalRiskFreezesTreasurySegment: true,
    unfreezeRequiresEvidence: true,
    unfreezeRequiresHumanApproval: true
  },
  reconciliationMatrix: [
    {
      source: "stripe_vs_ledger",
      frequency: "15m",
      toleranceMinor: 0,
      failAction: "HIGH risk flag + freeze Stripe payout source"
    },
    {
      source: "payout_vs_bank",
      frequency: "daily",
      toleranceMinor: 1,
      failAction: "HIGH risk flag + freeze payout queue"
    },
    {
      source: "zencoin_vs_chain",
      frequency: "30m",
      toleranceMinor: 0,
      failAction: "HIGH risk flag + freeze bridge movement"
    },
    {
      source: "ledger_vs_custody",
      frequency: "hourly",
      toleranceMinor: 100,
      failAction: "CRITICAL risk flag if material imbalance"
    }
  ],
  escalation: [
    { riskLevel: "LOW", freezeState: "SAFE", autoFreeze: false },
    { riskLevel: "MEDIUM", freezeState: "WATCH", autoFreeze: false },
    { riskLevel: "HIGH", freezeState: "REVIEW", autoFreeze: true },
    { riskLevel: "CRITICAL", freezeState: "FROZEN", autoFreeze: true }
  ],
  nextPack: "LAFS Pack 06/08 — Treasury Constitution + Allocation Rules"
};

const status =
  fs.existsSync(path.join(root, requiredPreviousLock)) &&
  checks.every((check) => check.exists && check.bytes > 0) &&
  manifest.guards.paymentLiveMode === false &&
  manifest.guards.reconciliationRequiredBeforePayouts === true &&
  manifest.guards.unfreezeRequiresHumanApproval === true
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
  nextRequiredAction: "LAFS Pack 06/08 — Treasury Constitution + Allocation Rules"
};

fs.writeFileSync(path.join(dataDir, "reconciliation-risk-freeze.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(auditDir, "lafs-pack05-reconciliation-risk-freeze.json"), JSON.stringify(audit, null, 2) + "\n");
fs.writeFileSync(
  path.join(docsDir, "pack05-reconciliation-risk-freeze.md"),
  [
    "# LAFS Pack 05/08 — Reconciliation + Risk Freeze",
    "",
    "Status: RECONCILIATION_RISK_FREEZE_READY",
    "",
    "Rules:",
    "- Reconciliation is required before payout expansion.",
    "- HIGH risk freezes the affected source for review.",
    "- CRITICAL risk freezes the affected treasury segment.",
    "- Unfreeze requires evidence and human approval.",
    "- Payment live mode remains false for pre-beta.",
    "",
    "Next: LAFS Pack 06/08 — Treasury Constitution + Allocation Rules",
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack05_reconciliation_risk_freeze_lock"), "LAFS_PACK05_RECONCILIATION_RISK_FREEZE=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_lafs_pack05_reconciliation_risk_freeze_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack05_reconciliation_risk_freeze_failed_lock"), "LAFS_PACK05_RECONCILIATION_RISK_FREEZE=FAIL\n");
}

console.log(JSON.stringify(audit, null, 2));
if (status !== "PASS") process.exitCode = 1;
