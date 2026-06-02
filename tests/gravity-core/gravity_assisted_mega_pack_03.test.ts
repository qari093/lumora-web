import { describe, expect, it } from "vitest";
import {
  computeAssistedConfirmation,
  computeAssistedNavigation,
  predictAssistedReturn,
  type GravityAssistedDecision,
} from "@/src/core/gravity-core";

const readyDecision: GravityAssistedDecision = {
  integrated: true,
  enabled: true,
  stage: "ready_to_assist",
  canRevealPortal: true,
  canSuggestReturn: true,
  canNavigate: false,
  confidence: 0.91,
  reason: "high_confidence_assist_ready",
};

describe("Gravity Assisted Mega Pack 3/5", () => {
  it("keeps navigation disabled when assisted is disabled", () => {
    const nav = computeAssistedNavigation({
      ...readyDecision,
      enabled: false,
      stage: "disabled",
      canSuggestReturn: false,
    });

    expect(nav.integrated).toBe(true);
    expect(nav.enabled).toBe(false);
    expect(nav.canNavigate).toBe(false);
    expect(nav.target).toBe(null);
  });

  it("prepares soft navigation without route change", () => {
    const nav = computeAssistedNavigation(readyDecision);

    expect(nav.enabled).toBe(true);
    expect(nav.softNavigationPrepared).toBe(true);
    expect(nav.confirmationRequired).toBe(true);
    expect(nav.target).toBe("/");
    expect(nav.canNavigate).toBe(false);
  });

  it("requires explicit confirmation", () => {
    const confirmation = computeAssistedConfirmation(computeAssistedNavigation(readyDecision));

    expect(confirmation.integrated).toBe(true);
    expect(confirmation.confirmationVisible).toBe(true);
    expect(confirmation.requiresExplicitRelease).toBe(true);
    expect(confirmation.canNavigate).toBe(false);
  });

  it("predicts return intent without navigation", () => {
    const prediction = predictAssistedReturn(readyDecision);

    expect(prediction.likelyReturnIntent).toBe(true);
    expect(prediction.confidence).toBeGreaterThanOrEqual(0.88);
  });

  it("does not prepare navigation when confidence is weak", () => {
    const nav = computeAssistedNavigation({
      ...readyDecision,
      stage: "candidate",
      canSuggestReturn: false,
      confidence: 0.65,
    });

    expect(nav.softNavigationPrepared).toBe(false);
    expect(nav.canNavigate).toBe(false);
  });
});
