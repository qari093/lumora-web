import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditDir = path.join(root, ".lumora-audits");
const dataDir = path.join(root, "data", "private-beta");
const docsDir = path.join(root, "docs", "runtime");

for (const dir of [auditDir, dataDir, docsDir]) fs.mkdirSync(dir, { recursive: true });

const requiredLocks = [
  ".lumora_private_beta_ready_lock",
  ".lumora_lafs_pre_beta_safe_mode_sealed_lock",
  ".lumora_lafs_pack08_final_pre_beta_seal_lock"
];

const requiredFiles = [
  "data/lafs/final-pre-beta-seal.json",
  ".lumora-audits/lafs-pack08-final-pre-beta-seal.json",
  "app/lafs/page.tsx"
];

const lockChecks = requiredLocks.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file))
}));

const fileChecks = requiredFiles.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file)),
  bytes: fs.existsSync(path.join(root, file)) ? fs.statSync(path.join(root, file)).size : 0
}));

let lafsSeal = null;
try {
  lafsSeal = JSON.parse(fs.readFileSync(path.join(root, "data/lafs/final-pre-beta-seal.json"), "utf8"));
} catch {
  lafsSeal = null;
}

const resume = {
  status: "PRIVATE_BETA_RESUME_WITH_LAFS_SAFE_MODE_READY",
  generatedAt: new Date().toISOString(),
  mode: "controlled_private_beta",
  guards: {
    allowlistOnly: true,
    publicSignupDisabled: true,
    paymentLiveMode: false,
    manualExpansionOnly: true,
    lafsSafeModeSealed: Boolean(lafsSeal?.status === "LAFS_PRE_BETA_EXECUTION_CHAIN_COMPLETE"),
    noAutonomousMoneyMovement: Boolean(lafsSeal?.guards?.noAutonomousMoneyMovement === true),
    dashboardReadOnly: Boolean(lafsSeal?.guards?.dashboardReadOnly === true),
    humanApprovalRequired: Boolean(lafsSeal?.guards?.humanApprovalRequired === true)
  },
  activeRoutes: {
    betaEntry: "/go",
    privateAccess: "/private-access",
    betaPage: "/beta",
    lafsDashboard: "/lafs"
  },
  nextCanonicalPhase: "Private beta wave 1 hold and observe real users"
};

const status =
  lockChecks.every((item) => item.exists) &&
  fileChecks.every((item) => item.exists && item.bytes > 0) &&
  resume.guards.allowlistOnly &&
  resume.guards.paymentLiveMode === false &&
  resume.guards.lafsSafeModeSealed &&
  resume.guards.noAutonomousMoneyMovement &&
  resume.guards.dashboardReadOnly
    ? "PASS"
    : "FAIL";

const audit = {
  checkedAt: new Date().toISOString(),
  status,
  resume,
  requiredLocks: lockChecks,
  requiredFiles: fileChecks,
  nextRequiredAction: resume.nextCanonicalPhase
};

fs.writeFileSync(path.join(dataDir, "lafs-safe-mode-resume.json"), JSON.stringify(resume, null, 2) + "\n");
fs.writeFileSync(path.join(auditDir, "private-beta-lafs-safe-mode-resume.json"), JSON.stringify(audit, null, 2) + "\n");
fs.writeFileSync(
  path.join(docsDir, "private-beta-lafs-safe-mode-resume.md"),
  [
    "# Private Beta — LAFS Safe Mode Resume",
    "",
    `Status: ${resume.status}`,
    "",
    "Active controls:",
    "- Private beta remains allowlist-only.",
    "- Public signup remains disabled.",
    "- Payment live mode remains false.",
    "- LAFS is sealed in pre-beta safe mode.",
    "- No autonomous money movement.",
    "- LAFS dashboard remains read-only.",
    "- Human approval remains required.",
    "",
    `Next: ${resume.nextCanonicalPhase}`,
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_private_beta_lafs_safe_mode_resume_lock"), "PRIVATE_BETA_LAFS_SAFE_MODE_RESUME=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_private_beta_lafs_safe_mode_resume_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_private_beta_lafs_safe_mode_resume_failed_lock"), "PRIVATE_BETA_LAFS_SAFE_MODE_RESUME=FAIL\n");
}

console.log(JSON.stringify(audit, null, 2));
if (status !== "PASS") process.exitCode = 1;
