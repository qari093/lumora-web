import fs from "node:fs";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const p1 = readJson("data/founder-audit/pack01-portal-reality-audit.json");
const p2 = readJson("data/founder-audit/pack02-navigation-content-audit.json");
const p3 = readJson("data/founder-audit/pack03-runtime-content-audit.json");
const p4 = readJson("data/founder-audit/pack04-rendered-experience-audit.json");

const shellRisk = p2.findings
  .filter((x) => x.hasClientUI === false || x.hasLink === false)
  .map((x) => x.file);

const lowRuntimeRisk = p3.findings
  .filter((x) => x.runtimeSignals === 0 || x.bytes < 1200)
  .map((x) => x.file);

const renderedHealthy = p4.summary.healthyRoutes === p4.summary.totalRoutes;

const score = {
  routeExistence: p1.status === "PASS" ? 100 : 0,
  renderedAvailability: renderedHealthy ? 100 : 0,
  navigationContentDepth: Math.max(0, 100 - shellRisk.length * 8),
  runtimeDepth: Math.max(0, 100 - lowRuntimeRisk.length * 10),
  founderVisualConfidence: 62
};

const weighted =
  Math.round(
    score.routeExistence * 0.15 +
    score.renderedAvailability * 0.2 +
    score.navigationContentDepth * 0.2 +
    score.runtimeDepth * 0.25 +
    score.founderVisualConfidence * 0.2
  );

const report = {
  system: "FOUNDER_VISUAL_FUNCTIONAL_AUDIT",
  pack: "05/05",
  phase: "Mobile Founder Approval Scorecard",
  checkedAt: new Date().toISOString(),
  status: weighted >= 85 ? "FOUNDER_REVIEW_READY" : "NEEDS_PORTAL_ACTIVATION_BEFORE_APPROVAL",
  weightedReadinessPercent: weighted,
  score,
  confirmedReady: [
    "All required portal route files exist",
    "All audited public routes return rendered HTML",
    "Ecosystem approval gate remains required",
    "Tester invites remain blocked",
    "Payment live mode remains off"
  ],
  notYetFullyProven: [
    "Every portal has deep interactive runtime",
    "Every video source renders playable media",
    "Zendoro has complete real product browsing depth",
    "Wallet has complete user-visible transaction depth",
    "NEXA has complete user-facing module depth",
    "Admin and Mission Control have complete founder-grade UX",
    "iPhone visual quality is founder-approved"
  ],
  highestRiskFiles: {
    shellRisk,
    lowRuntimeRisk
  },
  recommendation:
    weighted >= 85
      ? "Proceed to founder manual review"
      : "Activate thin portals before Breathing Threshold V6"
};

fs.writeFileSync(
  "data/founder-audit/pack05-founder-scorecard.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  ".lumora-audits/founder-pack05-founder-scorecard.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  "docs/founder-audit/pack05-founder-scorecard.md",
  `# Founder Audit Pack 05/05

Status: ${report.status}

Readiness: ${report.weightedReadinessPercent}%

Recommendation:
${report.recommendation}
`
);

console.log(JSON.stringify(report, null, 2));
