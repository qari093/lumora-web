export type CreatorLedgerStatus = {
  feature: "creator-ledger";
  status: "deferred";
  reason: "trust_first_then_monetization";
  activationRequiresTrustGate: true;
};

export function getCreatorLedgerStatus(): CreatorLedgerStatus {
  return {
    feature: "creator-ledger",
    status: "deferred",
    reason: "trust_first_then_monetization",
    activationRequiresTrustGate: true,
  };
}
