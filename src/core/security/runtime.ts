export const securityAuditRuntimeEnabled = true;

export function validateRateLimit(count: number) {
  return count < 100;
}
