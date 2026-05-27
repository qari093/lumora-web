export const walletSessions = {
  activeSessionTracking: true,
  multiDeviceAwareness: true,
  suspiciousSessionDetection: true,
  revokeSupported: true
} as const;

export function walletSessionHealthy(): boolean {
  return (
    walletSessions.activeSessionTracking &&
    walletSessions.multiDeviceAwareness &&
    walletSessions.suspiciousSessionDetection &&
    walletSessions.revokeSupported
  );
}
