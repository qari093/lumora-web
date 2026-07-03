export function createShareLoadTestPlan(params: {
  sharesPerMinute: number;
  concurrentUsers: number;
  durationMinutes: number;
}) {
  const totalShares = params.sharesPerMinute * params.durationMinutes;

  return {
    id: `usl_load_${params.sharesPerMinute}_${params.concurrentUsers}_${params.durationMinutes}`,
    sharesPerMinute: params.sharesPerMinute,
    concurrentUsers: params.concurrentUsers,
    durationMinutes: params.durationMinutes,
    totalShares,
    targetP95Ms: 450,
    targetErrorRate: 0.01,
  };
}

export function evaluateLoadTestResult(params: {
  p95Ms: number;
  errorRate: number;
  delivered: number;
  expected: number;
}) {
  const latencyScore = Math.max(0, 1 - Math.max(0, params.p95Ms - 450) / 1000);
  const errorScore = Math.max(0, 1 - params.errorRate / 0.05);
  const deliveryScore = Math.min(1, params.delivered / Math.max(1, params.expected));

  return Number(((latencyScore + errorScore + deliveryScore) / 3).toFixed(4));
}
