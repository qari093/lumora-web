import fs from "fs";

const data = JSON.parse(
  fs.readFileSync(
    "data/ecosystem/pack08-final-ecosystem-approval-seal.json",
    "utf8"
  )
);

const ok =
  data.status === "PASS" &&
  data.approvalState.ecosystemReviewReady === true &&
  data.finalGate.waqarApprovalRequired === true &&
  data.finalGate.ecosystemApproved === false &&
  data.finalGate.betaInvitesAllowed === false;

if (!ok) process.exit(1);

console.log(JSON.stringify({
  ok: true,
  pack: "08/08",
  phase: data.phase,
  result: data.result
}, null, 2));
