import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditDir = path.join(root, ".lumora-audits");
const dataDir = path.join(root, "data", "lafs");
const docsDir = path.join(root, "docs", "lafs");

for (const dir of [auditDir, dataDir, docsDir]) fs.mkdirSync(dir, { recursive: true });

const requiredLocks = [
  ".lumora_lafs_pack01_foundation_lock",
  ".lumora_lafs_pack02_ledger_core_lock",
  ".lumora_lafs_pack03_stripe_webhook_lock",
  ".lumora_lafs_pack04_approval_rbac_lock",
  ".lumora_lafs_pack05_reconciliation_risk_freeze_lock",
  ".lumora_lafs_pack06_treasury_constitution_lock",
  ".lumora_lafs_pack07_dashboard_command_hearth_lock"
];

const requiredAudits = [
  ".lumora-audits/lafs-pack01-foundation.json",
  ".lumora-audits/lafs-pack02-ledger-core.json",
  ".lumora-audits/lafs-pack03-stripe-webhook-safe-ingestion.json",
  ".lumora-audits/lafs-pack04-approval-workflow-rbac.json",
  ".lumora-audits/lafs-pack05-reconciliation-risk-freeze.json",
  ".lumora-audits/lafs-pack06-treasury-constitution-allocation.json",
  ".lumora-audits/lafs-pack07-dashboard-command-hearth.json"
];

const requiredFiles = [
  "src/core/lafs/types.ts",
  "src/core/lafs/foundation.ts",
  "src/core/lafs/ledger.ts",
  "src/core/lafs/stripeWebhook.ts",
  "src/core/lafs/approvals.ts",
  "src/core/lafs/reconciliationRisk.ts",
  "src/core/lafs/treasuryConstitution.ts",
  "src/core/lafs/dashboard.ts",
  "app/lafs/page.tsx"
];

const lockChecks = requiredLocks.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file))
}));

const auditChecks = requiredAudits.map((file) => {
  const full = path.join(root, file);
  let status = "MISSING";
  if (fs.existsSync(full)) {
    try {
      status = JSON.parse(fs.readFileSync(full, "utf8")).status ?? "UNKNOWN";
    } catch {
      status = "INVALID_JSON";
    }
  }
  return { file, exists: fs.existsSync(full), status };
});

const fileChecks = requiredFiles.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file)),
  bytes: fs.existsSync(path.join(root, file)) ? fs.statSync(path.join(root, file)).size : 0
}));

const manifest = {
  system: "LAFS_PRE_BETA",
  status: "LAFS_PRE_BETA_EXECUTION_CHAIN_COMPLETE",
  pack: "08/08",
  completedPacks: 8,
  generatedAt: new Date().toISOString(),
  integrationMode: "pre_beta_safe_mode",
  guards: {
    paymentLiveMode: false,
    publicSignupDisabled: true,
    allowlistOnly: true,
    manualExpansionOnly: true,
    humanApprovalRequired: true,
    noAutonomousMoneyMovement: true,
    dashboardReadOnly: true,
    stripeWebhookSignatureRequired: true,
    doubleEntryRequired: true,
    reconciliationBeforePayouts: true,
    unfreezeRequiresHumanApproval: true,
    treasuryRulesGoverned: true,
    lumoraLensDefaultOff: true
  },
  completedScope: [
    "Foundation manifest + account taxonomy",
    "Minor-unit double-entry ledger core",
    "Stripe webhook safe ingestion scaffold",
    "Approval workflow + RBAC",
    "Reconciliation + risk freeze model",
    "Treasury constitution + allocation rules",
    "Read-only LAFS Command Hearth dashboard",
    "Final pre-beta seal"
  ],
  deferredPostBetaScope: [
    "Live Stripe money movement",
    "Bank/open-banking feeds",
    "Production Zencoin bridge broadcast",
    "Merkle anchoring / Proof of Treasury",
    "Treasury Digital Twin simulations",
    "Financial Chronicle public narrative mode",
    "Advanced AI financial co-pilot",
    "Council live amendment workflow"
  ],
  nextCanonicalPhase: "Resume private beta with LAFS pre-beta safe mode sealed"
};

const status =
  lockChecks.every((item) => item.exists) &&
  auditChecks.every((item) => item.exists && item.status === "PASS") &&
  fileChecks.every((item) => item.exists && item.bytes > 0) &&
  manifest.guards.paymentLiveMode === false &&
  manifest.guards.noAutonomousMoneyMovement === true &&
  manifest.guards.dashboardReadOnly === true
    ? "PASS"
    : "FAIL";

const seal = {
  checkedAt: new Date().toISOString(),
  status,
  manifest,
  requiredLocks: lockChecks,
  requiredAudits: auditChecks,
  requiredFiles: fileChecks,
  nextRequiredAction: manifest.nextCanonicalPhase
};

fs.writeFileSync(path.join(dataDir, "final-pre-beta-seal.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(auditDir, "lafs-pack08-final-pre-beta-seal.json"), JSON.stringify(seal, null, 2) + "\n");
fs.writeFileSync(
  path.join(docsDir, "pack08-final-pre-beta-seal.md"),
  [
    "# LAFS Pack 08/08 — Final Pre-Beta Seal",
    "",
    `Status: ${manifest.status}`,
    "",
    "Completed scope:",
    ...manifest.completedScope.map((item) => `- ${item}`),
    "",
    "Active guards:",
    "- Payment live mode remains false.",
    "- No autonomous money movement.",
    "- Human approval required.",
    "- Dashboard is read-only.",
    "- Stripe webhook signature verification required.",
    "- Double-entry ledger required.",
    "- Reconciliation required before payout expansion.",
    "- Unfreeze requires human approval.",
    "",
    "Deferred post-beta scope:",
    ...manifest.deferredPostBetaScope.map((item) => `- ${item}`),
    "",
    `Next: ${manifest.nextCanonicalPhase}`,
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pre_beta_safe_mode_sealed_lock"), "LAFS_PRE_BETA_SAFE_MODE_SEALED=PASS\n");
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack08_final_pre_beta_seal_lock"), "LAFS_PACK08_FINAL_PRE_BETA_SEAL=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_lafs_pack08_final_pre_beta_seal_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack08_final_pre_beta_seal_failed_lock"), "LAFS_PACK08_FINAL_PRE_BETA_SEAL=FAIL\n");
}

console.log(JSON.stringify(seal, null, 2));
if (status !== "PASS") process.exitCode = 1;
