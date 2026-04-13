export const TRUST_STATES = [
  "official",
  "verified",
  "partner-approved",
  "trusted-editorial",
  "community-signal",
  "unverified",
  "suppressed",
] as const;

export type TrustState = typeof TRUST_STATES[number];

export function isTrustState(value: string): value is TrustState {
  return TRUST_STATES.includes(value as TrustState);
}

export function assertTrustState(value: string): asserts value is TrustState {
  if (!isTrustState(value)) {
    throw new Error(`Invalid trust state: ${value}`);
  }
}

export const TRUST_STATE_PRIORITY: Record<TrustState, number> = {
  official: 100,
  verified: 90,
  "partner-approved": 80,
  "trusted-editorial": 70,
  "community-signal": 40,
  unverified: 10,
  suppressed: 0,
};
