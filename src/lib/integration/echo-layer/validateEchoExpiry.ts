export function validateEcho24hExpiry(input: {
  nowMs: number;
  expiresAtMs: number;
}) {
  return {
    active: input.nowMs < input.expiresAtMs,
    expired: input.nowMs >= input.expiresAtMs,
  };
}
