export const profileRuntime = {
  readinessProfile: true,
  emotionalProfile: true,
  wearableBridge: true
};

export function profileHealthy() {
  return Object.values(profileRuntime).every(Boolean);
}
