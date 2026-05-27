export const sellerFoundation = {
  onboarding: true,
  kyc: true,
  storefronts: true,
  payouts: true,
  inventory: true,
  mobileRuntime: true
} as const;

export function sellerFoundationHealthy(): boolean {
  return (
    sellerFoundation.onboarding &&
    sellerFoundation.kyc &&
    sellerFoundation.storefronts &&
    sellerFoundation.payouts &&
    sellerFoundation.inventory &&
    sellerFoundation.mobileRuntime
  );
}
