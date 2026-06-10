import fs from "node:fs";

const requiredAudits = [
  ".lumora-audits/fyp-activation-audit.json",
  ".lumora-audits/live-activation-audit.json",
  ".lumora-audits/gmar-activation-audit.json",
  ".lumora-audits/nexa-activation-audit.json",
  ".lumora-audits/zendoro-activation-audit.json",
  ".lumora-audits/wallet-activation-audit.json"
];

const audits = requiredAudits.map(file => {
  const exists = fs.existsSync(file);
  const json = exists ? JSON.parse(fs.readFileSync(file, "utf8")) : null;

  return {
    file,
    exists,
    status: json?.status ?? "MISSING"
  };
});

const allPass = audits.every(a => a.exists && a.status === "PASS");

const report = {
  system: "FINAL_FOUNDER_ECOSYSTEM_VALIDATION",
  checkedAt: new Date().toISOString(),
  status: allPass ? "PASS" : "FAIL",
  founderActivationPacksCompleted: audits.filter(a => a.status === "PASS").length,
  founderActivationPacksTotal: audits.length,
  audits,
  ecosystemApprovalStillRequired: true,
  testerInvitesAllowed: false,
  paymentLiveModeAllowed: false,
  result: allPass
    ? "READY_FOR_FOUNDER_VISUAL_REVIEW"
    : "FOUNDATION_INCOMPLETE"
};

fs.writeFileSync(
  "data/founder-activation/final-founder-ecosystem-validation.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  ".lumora-audits/final-founder-ecosystem-validation.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  "docs/founder-activation/final-founder-ecosystem-validation.md",
  `# Final Founder Ecosystem Validation

Status: ${report.status}

Founder Packs: ${report.founderActivationPacksCompleted}/${report.founderActivationPacksTotal}

Tester Invites Allowed: false
Payments Live Allowed: false
Founder Approval Required: true
`
);

console.log(JSON.stringify(report, null, 2));

if (!allPass) process.exitCode = 1;
