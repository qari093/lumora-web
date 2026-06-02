export const GRAVITY_CORE_ASSISTED_FLAG = "GRAVITY_CORE_ASSISTED";

export type GravityAssistedActivationState = {
  integrated: boolean;
  enabled: boolean;
  rolloutPercent: number;
  reason: string;
};

export function getGravityAssistedActivation(
  env: Record<string, string | undefined> = process.env,
): GravityAssistedActivationState {
  const raw = env.NEXT_PUBLIC_GRAVITY_CORE_ASSISTED ?? env.GRAVITY_CORE_ASSISTED ?? "false";
  const enabled = ["1", "true", "yes", "enabled"].includes(raw.toLowerCase());

  const rolloutRaw = Number(env.NEXT_PUBLIC_GRAVITY_CORE_ASSISTED_ROLLOUT ?? env.GRAVITY_CORE_ASSISTED_ROLLOUT ?? 0);
  const rolloutPercent = Number.isFinite(rolloutRaw) ? Math.max(0, Math.min(100, rolloutRaw)) : 0;

  return {
    integrated: true,
    enabled,
    rolloutPercent,
    reason: enabled ? "assisted_flag_enabled" : "assisted_integrated_but_disabled",
  };
}
