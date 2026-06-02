import { getGravityAssistedActivation } from "./assistedConfig";
import { promoteGravityIntentToAssisted } from "./assistedPromotion";
import type { GravityAssistedDecision } from "./assistedTypes";
import type { GravityIntentResult } from "./types";

export class GravityAssistedController {
  private enabled: boolean;
  private rolloutPercent: number;

  constructor(env: Record<string, string | undefined> = process.env) {
    const activation = getGravityAssistedActivation(env);
    this.enabled = activation.enabled;
    this.rolloutPercent = activation.rolloutPercent;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getRolloutPercent(): number {
    return this.rolloutPercent;
  }

  evaluate(
    intent: GravityIntentResult,
    options: {
      rolloutAllowed?: boolean;
      conflictActive?: boolean;
      fallbackAvailable?: boolean;
      telemetryHealthy?: boolean;
    } = {},
  ): GravityAssistedDecision {
    return promoteGravityIntentToAssisted({
      intent,
      assistedEnabled: this.enabled,
      rolloutAllowed: options.rolloutAllowed,
      conflictActive: options.conflictActive,
      fallbackAvailable: options.fallbackAvailable,
      telemetryHealthy: options.telemetryHealthy,
    });
  }
}
