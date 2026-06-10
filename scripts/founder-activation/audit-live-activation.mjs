import fs from "node:fs";

const pageFile = "app/live/page.tsx";
const coreFile = "src/core/founder-activation/liveActivation.ts";
const lockFile = ".lumora_founder_activation_pack02_live_lock";
const dataFile = "data/founder-activation/live-activation-fix.json";

const page = fs.existsSync(pageFile) ? fs.readFileSync(pageFile, "utf8") : "";
const core = fs.existsSync(coreFile) ? fs.readFileSync(coreFile, "utf8") : "";
const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : null;

const pageSignals = [
  "Live is now a visible pulse layer",
  "Founder gate active",
  "Public broadcast off",
  "Tester invites blocked",
  "Activated Live rooms",
  "visible rooms",
  "preview signals"
];

const coreSignals = [
  "LIVE_ACTIVATED_FOR_FOUNDER_REVIEW",
  "liveActivationRooms",
  "getLiveActivationSummary",
  "publicBroadcastEnabled: false",
  "testerInvitesBlocked: true",
  "safeMode: true"
];

const roomSignals = [
  "Live Pulse Room",
  "Creator Signal Room",
  "GMAR Watch Room",
  "Trust Review Room"
];

const backups = fs.existsSync("app/live")
  ? fs.readdirSync("app/live").filter((name) => name.startsWith("page.tsx.backup-founder-activation-"))
  : [];

const checks = {
  pageExists: fs.existsSync(pageFile),
  coreExists: fs.existsSync(coreFile),
  lockExists: fs.existsSync(lockFile),
  dataExists: fs.existsSync(dataFile),
  pageHasLiveSignals: pageSignals.every((item) => page.includes(item)),
  coreHasRuntimeSignals: coreSignals.every((item) => core.includes(item)),
  coreHasRoomSignals: roomSignals.every((item) => core.includes(item)),
  dataSafeMode: data?.safeMode === true,
  publicBroadcastOff: data?.publicBroadcastEnabled === false,
  testerInvitesBlocked: data?.testerInvitesBlocked === true,
  backupLeftoverExists: backups.length > 0
};

const status =
  checks.pageExists &&
  checks.coreExists &&
  checks.lockExists &&
  checks.dataExists &&
  checks.pageHasLiveSignals &&
  checks.coreHasRuntimeSignals &&
  checks.coreHasRoomSignals &&
  checks.dataSafeMode &&
  checks.publicBroadcastOff &&
  checks.testerInvitesBlocked &&
  !checks.backupLeftoverExists
    ? "PASS"
    : "FAIL";

const report = {
  system: "FOUNDER_ACTIVATION_AUDIT",
  portal: "LIVE",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  backups,
  result:
    status === "PASS"
      ? "LIVE_ROOM_UI_AND_RUNTIME_BRIDGES_CONFIRMED_FOR_FOUNDER_REVIEW"
      : "LIVE_ACTIVATION_INCOMPLETE"
};

fs.writeFileSync("data/founder-activation/live-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/live-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/founder-activation/live-activation-audit.md", `# Live Activation Audit

Status: ${status}

Result: ${report.result}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
