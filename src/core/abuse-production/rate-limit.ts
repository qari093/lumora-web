export function evaluateRateLimit(input: { count: number; limit: number }) {
  return {
    allowed: input.count <= input.limit,
    remaining: Math.max(0, input.limit - input.count),
  };
}
