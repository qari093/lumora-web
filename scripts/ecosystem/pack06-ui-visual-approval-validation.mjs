import fs from "fs";

const p = "data/ecosystem/pack06-ui-visual-approval-validation.json";
const j = JSON.parse(fs.readFileSync(p, "utf8"));

const ok =
  j.status === "PASS" &&
  j.visualValidation.homePagePresent &&
  j.visualValidation.portalNavigationPresent &&
  j.visualValidation.homeBeaconPresent &&
  j.visualValidation.lafsDashboardPresent &&
  j.approvalRules.ecosystemApprovalRequired;

if (!ok) process.exit(1);

console.log(JSON.stringify({
  ok: true,
  pack: "06/08",
  phase: j.phase
}, null, 2));
