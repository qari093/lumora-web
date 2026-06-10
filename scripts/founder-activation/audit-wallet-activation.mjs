import fs from "node:fs";

const pageFile = "app/wallet/page.tsx";
const coreFile = "src/core/founder-activation/walletActivation.ts";
const lockFile = ".lumora_founder_activation_pack06_wallet_lock";
const dataFile = "data/founder-activation/wallet-activation-fix.json";

const page = fs.existsSync(pageFile) ? fs.readFileSync(pageFile, "utf8") : "";
const core = fs.existsSync(coreFile) ? fs.readFileSync(coreFile, "utf8") : "";
const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : null;

const pageSignals = [
  "Wallet and Zen Economy are now visible founder review layers",
  "Founder gate active",
  "Payments disabled",
  "Zencoin bridge disabled",
  "Tester invites blocked",
  "Wallet Overview",
  "Zen Economy",
  "Transaction Ledger",
  "Treasury View"
];

const coreSignals = [
  "WALLET_ZENECONOMY_ACTIVATED_FOR_FOUNDER_REVIEW",
  "walletActivationSurfaces",
  "getWalletActivationSummary",
  "walletLive: false",
  "paymentsLive: false",
  "zencoinBridgeLive: false",
  "testerInvitesBlocked: true",
  "safeMode: true"
];

const backups = fs.existsSync("app/wallet")
  ? fs.readdirSync("app/wallet").filter((name) => name.startsWith("page.tsx.backup-founder-activation-"))
  : [];

const checks = {
  pageExists: fs.existsSync(pageFile),
  coreExists: fs.existsSync(coreFile),
  lockExists: fs.existsSync(lockFile),
  dataExists: fs.existsSync(dataFile),
  pageHasWalletSignals: pageSignals.every((item) => page.includes(item)),
  coreHasRuntimeSignals: coreSignals.every((item) => core.includes(item)),
  dataSafeMode: data?.safeMode === true,
  walletLiveOff: data?.walletLive === false,
  paymentsLiveOff: data?.paymentsLive === false,
  zencoinBridgeOff: data?.zencoinBridgeLive === false,
  testerInvitesBlocked: data?.testerInvitesBlocked === true,
  backupLeftoverExists: backups.length > 0
};

const status =
  checks.pageExists &&
  checks.coreExists &&
  checks.lockExists &&
  checks.dataExists &&
  checks.pageHasWalletSignals &&
  checks.coreHasRuntimeSignals &&
  checks.dataSafeMode &&
  checks.walletLiveOff &&
  checks.paymentsLiveOff &&
  checks.zencoinBridgeOff &&
  checks.testerInvitesBlocked &&
  !checks.backupLeftoverExists
    ? "PASS"
    : "FAIL";

const report = {
  system: "FOUNDER_ACTIVATION_AUDIT",
  portal: "WALLET_ZENECONOMY",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  backups,
  result: status === "PASS"
    ? "WALLET_ZENECONOMY_LAYER_CONFIRMED_FOR_FOUNDER_REVIEW"
    : "WALLET_ZENECONOMY_ACTIVATION_INCOMPLETE"
};

fs.writeFileSync("data/founder-activation/wallet-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/wallet-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/founder-activation/wallet-activation-audit.md", `# Wallet + ZenEconomy Activation Audit

Status: ${status}

Result: ${report.result}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
