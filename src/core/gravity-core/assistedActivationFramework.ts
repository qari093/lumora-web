import { evaluateAssistedLearning, type GravityAssistedLearningInput } from "./assistedLearning";

export type GravityAssistedActivationDecision = {
  integrated: boolean;
  assistedCodeComplete: boolean;
  activationSwitchReady: boolean;
  enabledNow: boolean;
  rolloutPercent: number;
  canActivate: boolean;
  reason: string;
};

export function decideGravityAssistedActivation(
  input: GravityAssistedLearningInput,
  env: Record<string, string | undefined> = process.env,
): GravityAssistedActivationDecision {
  const rawEnabled = env.NEXT_PUBLIC_GRAVITY_CORE_ASSISTED ?? env.GRAVITY_CORE_ASSISTED ?? "false";
  const enabledNow = ["1", "true", "yes", "enabled"].includes(rawEnabled.toLowerCase());

  const rolloutRaw = Number(env.NEXT_PUBLIC_GRAVITY_CORE_ASSISTED_ROLLOUT ?? env.GRAVITY_CORE_ASSISTED_ROLLOUT ?? 0);
  const rolloutPercent = Number.isFinite(rolloutRaw) ? Math.max(0, Math.min(100, rolloutRaw)) : 0;

  const learning = evaluateAssistedLearning(input);
  const canActivate = enabledNow && rolloutPercent > 0 && learning.canUnlockAssisted;

  return {
    integrated: true,
    assistedCodeComplete: true,
    activationSwitchReady: true,
    enabledNow,
    rolloutPercent,
    canActivate,
    reason: canActivate
      ? "assisted_activation_allowed_by_flag_rollout_and_telemetry"
      : "assisted_integrated_but_not_activated",
  };
}
