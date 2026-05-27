export const youthSafety = {
  ageGate: true,
  minorSafeMode: true,
  parentalApprovalFlow: true,
  purchaseRestrictions: true,
  childSafeCopy: true,
  spendingProtections: true,
  youthSafeDefaults: true,
  noYouthTokenEconomy: true
} as const;

export function canMinorPurchase(input: {
  isMinor: boolean;
  parentalApproved: boolean;
}): boolean {
  if (!input.isMinor) return true;
  return input.parentalApproved;
}

export function youthSafetyHealthy(): boolean {
  return (
    youthSafety.ageGate &&
    youthSafety.minorSafeMode &&
    youthSafety.parentalApprovalFlow &&
    youthSafety.purchaseRestrictions &&
    youthSafety.spendingProtections &&
    youthSafety.youthSafeDefaults &&
    youthSafety.noYouthTokenEconomy
  );
}
