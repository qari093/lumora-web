export const iapRuntime = {
  appleEnabled: true,
  googleEnabled: true,
  receiptValidation: true,
  replayProtection: true,
  refundAware: true
} as const;

export function iapHealthy(): boolean {
  return (
    iapRuntime.appleEnabled &&
    iapRuntime.googleEnabled &&
    iapRuntime.receiptValidation &&
    iapRuntime.replayProtection &&
    iapRuntime.refundAware
  );
}
