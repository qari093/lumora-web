export function validateMonetizationStress(input: {
  requestsPerMinute: number;
  maxRequestsPerMinute: number;
  errorRate: number;
  maxErrorRate: number;
}) {
  return {
    ok:
      input.requestsPerMinute <= input.maxRequestsPerMinute &&
      input.errorRate <= input.maxErrorRate,
    overloaded: input.requestsPerMinute > input.maxRequestsPerMinute,
    errorRisk: input.errorRate > input.maxErrorRate,
  };
}
