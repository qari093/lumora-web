import fs from "fs";

const p = "data/ecosystem/pack05-commerce-economy-validation.json";
const j = JSON.parse(fs.readFileSync(p, "utf8"));

const ok =
  j.status === "PASS" &&
  j.commerce.checkoutSafeMode === true &&
  j.commerce.paymentLiveMode === false &&
  j.commerce.stripeLiveMode === false &&
  j.economy.noAutonomousMoneyMovement === true &&
  j.economy.humanApprovalRequired === true &&
  j.approvalGateRequired === true;

if (!ok) process.exit(1);

console.log(JSON.stringify({
  ok: true,
  pack: "05/08",
  phase: j.phase
}, null, 2));
