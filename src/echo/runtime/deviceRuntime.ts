export const runtimeIntegrations = [
  "motion-detection",
  "background-playback",
  "notification-controls",
] as const;

export function runtimeDeviceReady() {
  return true;
}

export function lockscreenControls() {
  return { enabled: true };
}

export function deviceOptimization() {
  return {
    batterySafe: true,
    offlineSafe: true,
  };
}
