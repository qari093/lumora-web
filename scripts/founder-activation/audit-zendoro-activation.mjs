import fs from "node:fs";

const pageFile = "app/zendoro/page.tsx";
const coreFile = "src/core/founder-activation/zendoroActivation.ts";
const lockFile = ".lumora_founder_activation_pack05_zendoro_lock";
const dataFile = "data/founder-activation/zendoro-activation-fix.json";

const page = fs.existsSync(pageFile) ? fs.readFileSync(pageFile, "utf8") : "";
const core = fs.existsSync(coreFile) ? fs.readFileSync(coreFile, "utf8") : "";
const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : null;

const pageSignals = [
  "Zendoro is now a visible commerce and trust layer",
  "Founder gate active",
  "Checkout disabled",
  "Payouts disabled",
  "Tester invites blocked",
  "Product Discovery",
  "Seller Operations",
  "Trust Layer",
  "Commerce Engine"
];

const coreSignals = [
  "ZENDORO_ACTIVATED_FOR_FOUNDER_REVIEW",
  "zendoroActivationSurfaces",
  "getZendoroActivationSummary",
  "checkoutLive: false",
  "payoutsLive: false",
  "testerInvitesBlocked: true",
  "safeMode: true"
];

const backups = fs.existsSync("app/zendoro")
  ? fs.readdirSync("app/zendoro").filter((name) => name.startsWith("page.tsx.backup-founder-activation-"))
  : [];

const checks = {
  pageExists: fs.existsSync(pageFile),
  coreExists: fs.existsSync(coreFile),
  lockExists: fs.existsSync(lockFile),
  dataExists: fs.existsSync(dataFile),
  pageHasZendoroSignals: pageSignals.every((item) => page.includes(item)),
  coreHasRuntimeSignals: coreSignals.every((item) => core.includes(item)),
  dataSafeMode: data?.safeMode === true,
  checkoutDisabled: data?.checkoutLive === false,
  payoutsDisabled: data?.payoutsLive === false,
  testerInvitesBlocked: data?.testerInvitesBlocked === true,
  backupLeftoverExists: backups.length > 0
};

const status =
  checks.pageExists &&
  checks.coreExists &&
  checks.lockExists &&
  checks.dataExists &&
  checks.pageHasZendoroSignals &&
  checks.coreHasRuntimeSignals &&
  checks.dataSafeMode &&
  checks.checkoutDisabled &&
  checks.payoutsDisabled &&
  checks.testerInvitesBlocked &&
  !checks.backupLeftoverExists
    ? "PASS"
    : "FAIL";

const report = {
  system: "FOUNDER_ACTIVATION_AUDIT",
  portal: "ZENDORO",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  backups,
  result: status === "PASS"
    ? "ZENDORO_COMMERCE_TRUST_LAYER_CONFIRMED_FOR_FOUNDER_REVIEW"
    : "ZENDORO_ACTIVATION_INCOMPLETE"
};

fs.writeFileSync("data/founder-activation/zendoro-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/zendoro-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/founder-activation/zendoro-activation-audit.md", `# Zendoro Activation Audit

Status: ${status}

Result: ${report.result}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
