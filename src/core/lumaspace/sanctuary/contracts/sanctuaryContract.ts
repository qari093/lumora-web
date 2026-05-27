import type {
  SanctuaryTier,
  AuraEnhancement,
  SanctuaryRuntime
} from "../types";

export function validateSanctuaryTier(
  tier: SanctuaryTier
): boolean {
  return Boolean(
    tier.id &&
    tier.name
  );
}

export function validateAuraEnhancement(
  enhancement: AuraEnhancement
): boolean {
  return Boolean(
    enhancement.id &&
    enhancement.effect
  );
}

export function validateSanctuaryRuntime(
  runtime: SanctuaryRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.tierId
  );
}
