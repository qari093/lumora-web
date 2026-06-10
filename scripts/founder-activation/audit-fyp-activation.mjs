import fs from "node:fs";

const pageFile = "app/fyp/page.tsx";
const coreFile = "src/core/founder-activation/fypActivation.ts";
const lockFile = ".lumora_founder_activation_pack01_fyp_lock";
const dataFile = "data/founder-activation/fyp-activation-fix.json";

const page = fs.existsSync(pageFile) ? fs.readFileSync(pageFile, "utf8") : "";
const core = fs.existsSync(coreFile) ? fs.readFileSync(coreFile, "utf8") : "";
const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : null;

const requiredText = [
  "For You is now a living ecosystem gateway",
  "Founder gate active",
  "Tester invites blocked",
  "Payment live mode off",
  "Native Lumora Feed",
  "Live Pulse Rooms",
  "GMAR Mission Surface",
  "Zendoro Discovery",
  "NEXA Guidance"
];

const requiredCore = [
  "FYP_ACTIVATED_FOR_FOUNDER_REVIEW",
  "safeMode: true",
  "fypActivationItems",
  "getFypActivationSummary"
];

const checks = {
  pageExists: fs.existsSync(pageFile),
  coreExists: fs.existsSync(coreFile),
  lockExists: fs.existsSync(lockFile),
  dataExists: fs.existsSync(dataFile),
  pageHasAllRequiredText: requiredText.every((item) => page.includes(item)),
  coreHasAllRequiredRuntime: requiredCore.every((item) => core.includes(item)),
  dataSafeMode: data?.safeMode === true,
  testerInvitesBlocked: data?.testerInvitesBlocked === true,
  paymentLiveModeOff: data?.paymentLiveMode === false,
  backupLeftoverExists: fs.readdirSync("app/fyp").some((name) =>
    name.startsWith("page.tsx.backup-founder-activation-")
  )
};

const status =
  checks.pageExists &&
  checks.coreExists &&
  checks.lockExists &&
  checks.dataExists &&
  checks.pageHasAllRequiredText &&
  checks.coreHasAllRequiredRuntime &&
  checks.dataSafeMode &&
  checks.testerInvitesBlocked &&
  checks.paymentLiveModeOff
    ? "PASS"
    : "FAIL";

const report = {
  system: "FOUNDER_ACTIVATION_AUDIT",
  portal: "FYP",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  warnings: checks.backupLeftoverExists
    ? ["backup file exists under app/fyp and should be removed or ignored before final seal"]
    : [],
  result:
    status === "PASS"
      ? "FYP_ACTIVATION_CONFIRMED_FOR_FOUNDER_REVIEW"
      : "FYP_ACTIVATION_INCOMPLETE"
};

fs.writeFileSync("data/founder-activation/fyp-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-activation-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/founder-activation/fyp-activation-audit.md", `# FYP Activation Audit

Status: ${status}

Result: ${report.result}

Warnings:
${report.warnings.length ? report.warnings.map((w) => `- ${w}`).join("\n") : "- None"}
`);

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exitCode = 1;
