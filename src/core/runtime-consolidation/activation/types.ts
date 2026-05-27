import type { RuntimeDomain } from "../domainRegistry";

export type RuntimeActivationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface RuntimeActivationRule {
  domain: RuntimeDomain;
  level: RuntimeActivationLevel;
  label: string;
  monetized: boolean;
  publicEnabled: boolean;
  reason: string;
}

export interface RuntimeActivationDecision {
  domain: RuntimeDomain;
  requestedLevel: RuntimeActivationLevel;
  currentLevel: RuntimeActivationLevel;
  allowed: boolean;
  reason: string;
}
