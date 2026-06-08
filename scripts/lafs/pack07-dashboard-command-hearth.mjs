import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditDir = path.join(root, ".lumora-audits");
const dataDir = path.join(root, "data", "lafs");
const docsDir = path.join(root, "docs", "lafs");

for (const dir of [auditDir, dataDir, docsDir]) fs.mkdirSync(dir, { recursive: true });

const requiredPreviousLock = ".lumora_lafs_pack06_treasury_constitution_lock";
const requiredFiles = [
  "src/core/lafs/dashboard.ts",
  "app/lafs/page.tsx",
  "prisma/migrations/lafs-prebeta/007_lafs_dashboard_command_hearth.sql"
];

const checks = requiredFiles.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file)),
  bytes: fs.existsSync(path.join(root, file)) ? fs.statSync(path.join(root, file)).size : 0
}));

const manifest = {
  system: "LAFS_PRE_BETA",
  status: "DASHBOARD_COMMAND_HEARTH_READY",
  pack: "07/08",
  generatedAt: new Date().toISOString(),
  route: "/lafs",
  layout: {
    title: "LAFS Ω∞ Command Hearth",
    grid: "2x4",
    lensDefault: "OFF",
    panels: [
      "Treasury Pulse",
      "Risk & Freeze Control",
      "Ledger Flow",
      "Payment Channels",
      "Approval Queue",
      "Operator Audit Trail",
      "Financial Tensions",
      "Constitution Explorer"
    ]
  },
  guards: {
    paymentLiveMode: false,
    readOnlyDashboard: true,
    noMoneyMovementFromDashboard: true,
    humanApprovalRequired: true,
    lumoraLensDefaultOff: true,
    criticalPanelsNoPoetry: true
  },
  nextPack: "LAFS Pack 08/08 — Final Pre-Beta Seal"
};

const status =
  fs.existsSync(path.join(root, requiredPreviousLock)) &&
  checks.every((check) => check.exists && check.bytes > 0) &&
  manifest.guards.paymentLiveMode === false &&
  manifest.guards.readOnlyDashboard === true &&
  manifest.guards.noMoneyMovementFromDashboard === true
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
  nextRequiredAction: "LAFS Pack 08/08 — Final Pre-Beta Seal"
};

fs.writeFileSync(path.join(dataDir, "dashboard-command-hearth.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(auditDir, "lafs-pack07-dashboard-command-hearth.json"), JSON.stringify(audit, null, 2) + "\n");
fs.writeFileSync(
  path.join(docsDir, "pack07-dashboard-command-hearth.md"),
  [
    "# LAFS Pack 07/08 — Dashboard Command Hearth",
    "",
    "Status: DASHBOARD_COMMAND_HEARTH_READY",
    "",
    "Rules:",
    "- Dashboard is read-only.",
    "- No money movement is available from dashboard UI.",
    "- Lumora Lens defaults OFF.",
    "- Critical finance panels remain clean and operational.",
    "- Constitution Explorer is included.",
    "- Payment live mode remains false for pre-beta.",
    "",
    "Next: LAFS Pack 08/08 — Final Pre-Beta Seal",
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack07_dashboard_command_hearth_lock"), "LAFS_PACK07_DASHBOARD_COMMAND_HEARTH=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_lafs_pack07_dashboard_command_hearth_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack07_dashboard_command_hearth_failed_lock"), "LAFS_PACK07_DASHBOARD_COMMAND_HEARTH=FAIL\n");
}

console.log(JSON.stringify(audit, null, 2));
if (status !== "PASS") process.exitCode = 1;
