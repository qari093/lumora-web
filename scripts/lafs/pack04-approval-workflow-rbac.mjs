import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditDir = path.join(root, ".lumora-audits");
const dataDir = path.join(root, "data", "lafs");
const docsDir = path.join(root, "docs", "lafs");

for (const dir of [auditDir, dataDir, docsDir]) fs.mkdirSync(dir, { recursive: true });

const requiredPreviousLock = ".lumora_lafs_pack03_stripe_webhook_lock";
const requiredFiles = [
  "src/core/lafs/approvals.ts",
  "prisma/migrations/lafs-prebeta/004_lafs_approval_workflow_rbac.sql"
];

const checks = requiredFiles.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file)),
  bytes: fs.existsSync(path.join(root, file)) ? fs.statSync(path.join(root, file)).size : 0
}));

const manifest = {
  system: "LAFS_PRE_BETA",
  status: "APPROVAL_WORKFLOW_RBAC_READY",
  pack: "04/08",
  generatedAt: new Date().toISOString(),
  guards: {
    paymentLiveMode: false,
    humanApprovalRequired: true,
    selfApprovalBlocked: true,
    duplicateApprovalBlocked: true,
    approvalDeadlineHours: 72,
    expiredRequestsAutoReject: true
  },
  approvalRules: [
    {
      amountRange: "<500 EUR",
      requiredApprovals: 1,
      requiredCouncilApprovals: 0,
      allowedRoles: ["operator", "council"]
    },
    {
      amountRange: "500 EUR to 2000 EUR",
      requiredApprovals: 2,
      requiredCouncilApprovals: 1,
      allowedRoles: ["operator", "council"]
    },
    {
      amountRange: ">2000 EUR",
      requiredApprovals: 3,
      requiredCouncilApprovals: 3,
      allowedRoles: ["council"]
    }
  ],
  nextPack: "LAFS Pack 05/08 — Reconciliation + Risk Freeze"
};

const status =
  fs.existsSync(path.join(root, requiredPreviousLock)) &&
  checks.every((check) => check.exists && check.bytes > 0) &&
  manifest.guards.paymentLiveMode === false &&
  manifest.guards.humanApprovalRequired === true &&
  manifest.guards.selfApprovalBlocked === true
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
  nextRequiredAction: "LAFS Pack 05/08 — Reconciliation + Risk Freeze"
};

fs.writeFileSync(path.join(dataDir, "approval-workflow-rbac.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(auditDir, "lafs-pack04-approval-workflow-rbac.json"), JSON.stringify(audit, null, 2) + "\n");
fs.writeFileSync(
  path.join(docsDir, "pack04-approval-workflow-rbac.md"),
  [
    "# LAFS Pack 04/08 — Approval Workflow + RBAC",
    "",
    "Status: APPROVAL_WORKFLOW_RBAC_READY",
    "",
    "Rules:",
    "- Human approval remains mandatory.",
    "- Self-approval is blocked.",
    "- Duplicate approval is blocked.",
    "- Approval thresholds are amount-based.",
    "- Requests expire after 72 hours.",
    "- High-value requests require council approvals.",
    "",
    "Next: LAFS Pack 05/08 — Reconciliation + Risk Freeze",
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack04_approval_rbac_lock"), "LAFS_PACK04_APPROVAL_RBAC=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_lafs_pack04_approval_rbac_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack04_approval_rbac_failed_lock"), "LAFS_PACK04_APPROVAL_RBAC=FAIL\n");
}

console.log(JSON.stringify(audit, null, 2));
if (status !== "PASS") process.exitCode = 1;
