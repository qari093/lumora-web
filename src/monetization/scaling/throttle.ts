export function calculateMonetizationThrottle(input: {
  overloaded: boolean;
  errorRate: number;
}) {
  if (input.errorRate >= 0.05) {
    return { throttlePercent: 100, reason: "error_rate_high" };
  }

  if (input.overloaded) {
    return { throttlePercent: 50, reason: "load_protection" };
  }

  return { throttlePercent: 0, reason: "stable" };
}
