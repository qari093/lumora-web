import fs from "node:fs";

const pageFile = "app/fyp/page.tsx";
const coreFile = "src/core/founder-activation/fypActivation.ts";
const lockFile = ".lumora_founder_activation_pack01_fyp_lock";
const dataFile = "data/founder-activation/fyp-activation-fix.json";

const page = fs.existsSync(pageFile) ? fs.readFileSync(pageFile, "utf8") : "";
const core = fs.existsSync(coreFile) ? fs.readFileSync(coreFile, "utf8") : "";
const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : null;

const requiredPageSignals = [
  "For You is now a living ecosystem gateway",
  "Founder gate active",
  "Tester invites blocked",
  "Payment live mode off",
  "Playable FYP video feed",
  "rendered videos",
  "/api/fyp/native-feed",
  "<video"
];

const requiredCoreSignals = [
  "FYP_ACTIVATED_FOR_FOUNDER_REVIEW",
  "safeMode: true",
  "fypActivationItems",
  "getFypActivationSummary"
];

const portalBridgeSignals = [
  "Native Lumora Feed",
  "Live Pulse Rooms",
  "GMAR Mission Surface",
  "Zendoro Discovery",
  "NEXA Guidance"
];

const backups = fs.existsSync("app/fyp")
  ? fs.readdirSync("app/fyp").filter((name) => name.startsWith("page.tsx.backup-founder-activation-"))
  : [];

const checks = {
  pageExists: fs.existsSync(pageFile),
  coreExists: fs.existsSync(coreFile),
  lockExists: fs.existsSync(lockFile),
  dataExists: fs.existsSync(dataFile),
  pageHasRequiredRenderedVideoSignals: requiredPageSignals.every((item) => page.includes(item)),
  coreHasAllRequiredRuntime: requiredCoreSignals.every((item) => core.includes(item)),
  coreHasAllPortalBridgeLabels: portalBridgeSignals.every((item) => core.includes(item)),
  dataSafeMode: data?.safeMode === true,
  testerInvitesBlocked: data?.testerInvitesBlocked === true,
  paymentLiveModeOff: data?.paymentLiveMode === false,
  backupLeftoverExists: backups.length > 0
};

const status =
  checks.pageExists &&
  checks.coreExists &&
  checks.lockExists &&
  checks.dataExists &&
  checks.pageHasRequiredRenderedVideoSignals &&
  checks.coreHasAllRequiredRuntime &&
  checks.coreHasAllPortalBridgeLabels &&
  checks.dataSafeMode &&
  checks.testerInvitesBlocked &&
  checks.paymentLiveModeOff &&
  !checks.backupLeftoverExists
    ? "PASS"
    : "FAIL";

const report = {
  system: "FOUNDER_ACTIVATION_AUDIT",
  portal: "FYP",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  backups,
  result:
    status === "PASS"
      ? "FYP_VIDEO_UI_AND_PORTAL_BRIDGES_CONFIRMED_FOR_FOUNDER_REVIEW"
      : "FYP_ACTIVATION_INCOMPLETE"
};

fs.writeFileSync("data/founder-activation/fyp-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/founder-activation/fyp-activation-audit.md", `# FYP Activation Audit

Status: ${status}

Result: ${report.result}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
