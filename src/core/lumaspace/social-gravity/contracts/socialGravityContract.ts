import type {
  PresencePulse,
  OrbitSignal,
  SocialGravityRuntime
} from "../types";

export function validatePresencePulse(
  pulse: PresencePulse
): boolean {
  return Boolean(
    pulse.id &&
    pulse.aura
  );
}

export function validateOrbitSignal(
  signal: OrbitSignal
): boolean {
  return Boolean(
    signal.id &&
    signal.intensity > 0
  );
}

export function validateSocialGravityRuntime(
  runtime: SocialGravityRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.orbitId
  );
}
