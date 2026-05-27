export const zendoroDoctrine = {
  trustBeforeTransaction: true,
  contextBeforeClicks: true,
  resonanceBeforePressure: true,
  privacyBeforeOptimization: true
} as const;

export function zendoroDoctrineHealthy(): boolean {
  return (
    zendoroDoctrine.trustBeforeTransaction &&
    zendoroDoctrine.contextBeforeClicks &&
    zendoroDoctrine.resonanceBeforePressure &&
    zendoroDoctrine.privacyBeforeOptimization
  );
}
