export function evaluateMonetizationLoad(input: {
  requestsPerMinute: number;
  maxRequestsPerMinute: number;
  queueDepth: number;
  maxQueueDepth: number;
}) {
  const overloaded =
    input.requestsPerMinute > input.maxRequestsPerMinute ||
    input.queueDepth > input.maxQueueDepth;

  return {
    overloaded,
    mode: overloaded ? "protective" as const : "normal" as const,
  };
}
