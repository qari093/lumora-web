import fs from "node:fs";

const pageFile = "app/nexa/page.tsx";
const coreFile = "src/core/founder-activation/nexaActivation.ts";
const lockFile = ".lumora_founder_activation_pack04_nexa_lock";
const dataFile = "data/founder-activation/nexa-activation-fix.json";

const page = fs.existsSync(pageFile) ? fs.readFileSync(pageFile, "utf8") : "";
const core = fs.existsSync(coreFile) ? fs.readFileSync(coreFile, "utf8") : "";
const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : null;

const pageSignals = [
  "NEXA is now a visible guidance and wellbeing layer",
  "Founder gate active",
  "AI autonomy off",
  "Medical claims off",
  "Tester invites blocked",
  "Guidance Core",
  "Body Weather",
  "Creative Companion",
  "Trust Whisper"
];

const coreSignals = [
  "NEXA_ACTIVATED_FOR_FOUNDER_REVIEW",
  "nexaActivationModules",
  "getNexaActivationSummary",
  "aiAutonomyEnabled: false",
  "medicalClaimsEnabled: false",
  "testerInvitesBlocked: true",
  "safeMode: true"
];

const backups = fs.existsSync("app/nexa")
  ? fs.readdirSync("app/nexa").filter((name) => name.startsWith("page.tsx.backup-founder-activation-"))
  : [];

const checks = {
  pageExists: fs.existsSync(pageFile),
  coreExists: fs.existsSync(coreFile),
  lockExists: fs.existsSync(lockFile),
  dataExists: fs.existsSync(dataFile),
  pageHasNexaSignals: pageSignals.every((item) => page.includes(item)),
  coreHasRuntimeSignals: coreSignals.every((item) => core.includes(item)),
  dataSafeMode: data?.safeMode === true,
  aiAutonomyOff: data?.aiAutonomyEnabled === false,
  medicalClaimsOff: data?.medicalClaimsEnabled === false,
  testerInvitesBlocked: data?.testerInvitesBlocked === true,
  backupLeftoverExists: backups.length > 0
};

const status =
  checks.pageExists &&
  checks.coreExists &&
  checks.lockExists &&
  checks.dataExists &&
  checks.pageHasNexaSignals &&
  checks.coreHasRuntimeSignals &&
  checks.dataSafeMode &&
  checks.aiAutonomyOff &&
  checks.medicalClaimsOff &&
  checks.testerInvitesBlocked &&
  !checks.backupLeftoverExists
    ? "PASS"
    : "FAIL";

const report = {
  system: "FOUNDER_ACTIVATION_AUDIT",
  portal: "NEXA",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  backups,
  result: status === "PASS"
    ? "NEXA_GUIDANCE_WELLBEING_TRUST_LAYER_CONFIRMED_FOR_FOUNDER_REVIEW"
    : "NEXA_ACTIVATION_INCOMPLETE"
};

fs.writeFileSync("data/founder-activation/nexa-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/nexa-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/founder-activation/nexa-activation-audit.md", `# NEXA Activation Audit

Status: ${status}

Result: ${report.result}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
