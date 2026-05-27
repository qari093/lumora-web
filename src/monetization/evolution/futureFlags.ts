export const ACP_FUTURE_FLAGS = {
  ENABLE_ATTENTION_CREDITS: false,
  ENABLE_ATTENTION_QUEUE: false,
  ENABLE_CREATOR_BONDS: false,
  ENABLE_SPONSOR_BIDDING: false,
  ENABLE_PRIVACY_PROOFS: false,
} as const;

export function validateAcpFutureFlags() {
  return Object.values(ACP_FUTURE_FLAGS).every((value) => value === false);
}
