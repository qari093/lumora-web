import { describe, expect, it } from "vitest";
import {
  createGravityAssistedFinalSeal,
  decideGravityAssistedActivation,
  getGravityAssistedRolloutPlan,
} from "@/src/core/gravity-core";

const goodTelemetry = {
  attempts: 100,
  successfulRecognitions: 96,
  falsePositives: 2,
  frustrationEvents: 4,
  exposures: 120,
};

describe("Gravity Assisted Mega Pack 5/5", () => {
  it("keeps assisted mode disabled by default even with good telemetry", () => {
    const decision = decideGravityAssistedActivation(goodTelemetry, {});

    expect(decision.integrated).toBe(true);
    expect(decision.assistedCodeComplete).toBe(true);
    expect(decision.activationSwitchReady).toBe(true);
    expect(decision.enabledNow).toBe(false);
    expect(decision.canActivate).toBe(false);
  });

  it("allows activation only with flag rollout and telemetry", () => {
    const decision = decideGravityAssistedActivation(goodTelemetry, {
      GRAVITY_CORE_ASSISTED: "true",
      GRAVITY_CORE_ASSISTED_ROLLOUT: "5",
    });

    expect(decision.enabledNow).toBe(true);
    expect(decision.rolloutPercent).toBe(5);
    expect(decision.canActivate).toBe(true);
  });

  it("blocks activation when rollout is zero", () => {
    const decision = decideGravityAssistedActivation(goodTelemetry, {
      GRAVITY_CORE_ASSISTED: "true",
      GRAVITY_CORE_ASSISTED_ROLLOUT: "0",
    });

    expect(decision.canActivate).toBe(false);
  });

  it("defines safe rollout plan", () => {
    const rollout = getGravityAssistedRolloutPlan();

    expect(rollout.startsDisabled).toBe(true);
    expect(rollout.stages[0]).toBe(0);
    expect(rollout.maxInitialRollout).toBe(5);
  });

  it("creates final assisted seal with navigation disabled", () => {
    const seal = createGravityAssistedFinalSeal();

    expect(seal.status).toBe("ASSISTED_MODE_INTEGRATED_DISABLED_SEALED");
    expect(seal.shadowModeActive).toBe(true);
    expect(seal.assistedModeIntegrated).toBe(true);
    expect(seal.assistedModeEnabled).toBe(false);
    expect(seal.navigationEnabled).toBe(false);
    expect(seal.activationRequiresTelemetry).toBe(true);
  });
});
