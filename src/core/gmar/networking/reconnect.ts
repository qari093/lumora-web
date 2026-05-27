export type ReconnectDecision = {
  shouldReconnect: boolean;
  backoffMs: number;
  reason: "retry" | "max_attempts_reached";
};

export function decideReconnect(attempt: number): ReconnectDecision {
  if (attempt >= 5) {
    return { shouldReconnect: false, backoffMs: 0, reason: "max_attempts_reached" };
  }

  return {
    shouldReconnect: true,
    backoffMs: Math.min(1000 * Math.pow(2, attempt), 15000),
    reason: "retry",
  };
}
