export function scorePatternRisk(input: {
  identicalIntervals: number;
  totalEvents: number;
  uniqueDevices: number;
  uniqueUsers: number;
}) {
  const intervalRisk = input.totalEvents > 0 ? input.identicalIntervals / input.totalEvents : 0;
  const deviceRisk = input.uniqueUsers > 0 ? 1 - Math.min(1, input.uniqueDevices / input.uniqueUsers) : 0;

  return Math.max(0, Math.min(1, intervalRisk * 0.7 + deviceRisk * 0.3));
}
