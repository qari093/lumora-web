import type { RuntimeDomain } from "../domainRegistry";
import type {
  RuntimeActivationDecision,
  RuntimeActivationLevel,
  RuntimeActivationRule
} from "./types";
import { ACTIVATION_LEVEL_LABELS, RUNTIME_ACTIVATION_RULES } from "./registry";

export function getRuntimeActivationRule(domain: RuntimeDomain): RuntimeActivationRule {
  return RUNTIME_ACTIVATION_RULES.find((rule) => rule.domain === domain) ??
    RUNTIME_ACTIVATION_RULES.find((rule) => rule.domain === "unknown")!;
}

export function evaluateRuntimeActivation(input: {
  domain: RuntimeDomain;
  requestedLevel: RuntimeActivationLevel;
}): RuntimeActivationDecision {
  const rule = getRuntimeActivationRule(input.domain);
  const allowed = input.requestedLevel <= rule.level;

  return {
    domain: input.domain,
    requestedLevel: input.requestedLevel,
    currentLevel: rule.level,
    allowed,
    reason: allowed
      ? "activation_level_allowed"
      : `activation_blocked_until_${ACTIVATION_LEVEL_LABELS[rule.level]}`
  };
}

export function canActivatePublic(domain: RuntimeDomain): boolean {
  const rule = getRuntimeActivationRule(domain);
  return rule.level >= 4 && rule.publicEnabled;
}

export function canActivateMonetization(domain: RuntimeDomain): boolean {
  const rule = getRuntimeActivationRule(domain);
  return rule.level >= 5 && rule.monetized;
}

export function assertActivationAllowed(input: {
  domain: RuntimeDomain;
  requestedLevel: RuntimeActivationLevel;
}): void {
  const decision = evaluateRuntimeActivation(input);
  if (!decision.allowed) {
    throw new Error(decision.reason);
  }
}
