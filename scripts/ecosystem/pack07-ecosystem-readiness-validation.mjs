import fs from "fs";

const data = JSON.parse(
  fs.readFileSync(
    "data/ecosystem/pack07-ecosystem-readiness-validation.json",
    "utf8"
  )
);

const ok =
  data.status === "PASS" &&
  data.readiness.surfaceValidationComplete &&
  data.readiness.runtimeValidationComplete &&
  data.readiness.portalValidationComplete &&
  data.readiness.navigationValidationComplete &&
  data.readiness.commerceValidationComplete &&
  data.readiness.uiValidationComplete &&
  data.approvalGate.ecosystemApprovalRequired;

if (!ok) process.exit(1);

console.log(JSON.stringify({
  ok: true,
  pack: "07/08",
  phase: data.phase
}, null, 2));
