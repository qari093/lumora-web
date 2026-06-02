import { describe, expect, it } from "vitest";
import {
  GravityAssistedController,
  getGravityAssistedActivation,
  promoteGravityIntentToAssisted,
  type GravityIntentResult,
} from "@/src/core/gravity-core";

const strongIntent: GravityIntentResult = {
  state: "intent",
  direction: "down",
  velocity: 1.2,
  proximity: 0.95,
  intentScore: 0.91,
  confidence: 0.9,
  shadowOnly: true,
  shouldShowRing: true,
  shouldNavigate: false,
};

describe("Gravity Assisted Mega Pack 1/5", () => {
  it("is integrated but disabled by default", () => {
    const activation = getGravityAssistedActivation({});
    expect(activation.integrated).toBe(true);
    expect(activation.enabled).toBe(false);
    expect(activation.rolloutPercent).toBe(0);
  });

  it("never navigates while disabled", () => {
    const decision = promoteGravityIntentToAssisted({
      intent: strongIntent,
      assistedEnabled: false,
      rolloutAllowed: true,
    });

    expect(decision.integrated).toBe(true);
    expect(decision.enabled).toBe(false);
    expect(decision.stage).toBe("disabled");
    expect(decision.canNavigate).toBe(false);
  });

  it("can evaluate assisted readiness when enabled and rollout allowed", () => {
    const decision = promoteGravityIntentToAssisted({
      intent: strongIntent,
      assistedEnabled: true,
      rolloutAllowed: true,
      fallbackAvailable: true,
      telemetryHealthy: true,
    });

    expect(decision.enabled).toBe(true);
    expect(decision.stage).toBe("ready_to_assist");
    expect(decision.canRevealPortal).toBe(true);
    expect(decision.canSuggestReturn).toBe(true);
    expect(decision.canNavigate).toBe(false);
  });

  it("blocks assisted mode when fallback is unavailable", () => {
    const decision = promoteGravityIntentToAssisted({
      intent: strongIntent,
      assistedEnabled: true,
      rolloutAllowed: true,
      fallbackAvailable: false,
    });

    expect(decision.stage).toBe("blocked");
    expect(decision.canNavigate).toBe(false);
    expect(decision.reason).toBe("fallback_unavailable");
  });

  it("controller reads feature flag but keeps navigation disabled", () => {
    const controller = new GravityAssistedController({
      GRAVITY_CORE_ASSISTED: "true",
      GRAVITY_CORE_ASSISTED_ROLLOUT: "10",
    });

    const decision = controller.evaluate(strongIntent, {
      rolloutAllowed: true,
      fallbackAvailable: true,
      telemetryHealthy: true,
    });

    expect(controller.isEnabled()).toBe(true);
    expect(controller.getRolloutPercent()).toBe(10);
    expect(decision.canNavigate).toBe(false);
  });
});
