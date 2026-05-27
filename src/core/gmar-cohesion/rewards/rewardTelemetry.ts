export function rewardTelemetry(action: string) {
  return {
    action,
    tracked: true,
    domain: "gmar-reward"
  };
}
