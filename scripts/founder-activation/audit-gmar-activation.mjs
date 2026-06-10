import fs from "node:fs";

const pageFile = "app/gmar/page.tsx";
const coreFile = "src/core/founder-activation/gmarActivation.ts";
const lockFile = ".lumora_founder_activation_pack03_gmar_lock";
const dataFile = "data/founder-activation/gmar-activation-fix.json";

const page = fs.existsSync(pageFile) ? fs.readFileSync(pageFile, "utf8") : "";
const core = fs.existsSync(coreFile) ? fs.readFileSync(coreFile, "utf8") : "";
const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : null;

const pageSignals = [
  "GMAR is now a visible mission and economy layer",
  "Founder gate active",
  "Tester invites blocked",
  "Live rewards disabled",
  "Mission Surface",
  "Pulse Store",
  "Game Runtime",
  "Reward Engine"
];

const coreSignals = [
  "GMAR_ACTIVATED_FOR_FOUNDER_REVIEW",
  "gmarActivationItems",
  "getGmarActivationSummary",
  "liveRewardsEnabled: false",
  "testerInvitesBlocked: true",
  "safeMode: true"
];

const backups = fs.existsSync("app/gmar")
  ? fs.readdirSync("app/gmar").filter((name) => name.startsWith("page.tsx.backup-founder-activation-"))
  : [];

const checks = {
  pageExists: fs.existsSync(pageFile),
  coreExists: fs.existsSync(coreFile),
  lockExists: fs.existsSync(lockFile),
  dataExists: fs.existsSync(dataFile),
  pageHasGmarSignals: pageSignals.every((item) => page.includes(item)),
  coreHasRuntimeSignals: coreSignals.every((item) => core.includes(item)),
  dataSafeMode: data?.safeMode === true,
  liveRewardsDisabled: data?.liveRewardsEnabled === false,
  testerInvitesBlocked: data?.testerInvitesBlocked === true,
  backupLeftoverExists: backups.length > 0
};

const status =
  checks.pageExists &&
  checks.coreExists &&
  checks.lockExists &&
  checks.dataExists &&
  checks.pageHasGmarSignals &&
  checks.coreHasRuntimeSignals &&
  checks.dataSafeMode &&
  checks.liveRewardsDisabled &&
  checks.testerInvitesBlocked &&
  !checks.backupLeftoverExists
    ? "PASS"
    : "FAIL";

const report = {
  system: "FOUNDER_ACTIVATION_AUDIT",
  portal: "GMAR",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  backups,
  result: status === "PASS"
    ? "GMAR_MISSION_ECONOMY_RUNTIME_CONFIRMED_FOR_FOUNDER_REVIEW"
    : "GMAR_ACTIVATION_INCOMPLETE"
};

fs.writeFileSync("data/founder-activation/gmar-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/gmar-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/founder-activation/gmar-activation-audit.md", `# GMAR Activation Audit

Status: ${status}

Result: ${report.result}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
