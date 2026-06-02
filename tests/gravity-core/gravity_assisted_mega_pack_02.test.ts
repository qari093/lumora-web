import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  computeAssistedPortalReveal,
  computeAssistedReturnAffordance,
  getAssistedVisibilityTuning,
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

describe("Gravity Assisted Mega Pack 2/5", () => {
  it("keeps portal reveal disabled when assisted mode is disabled", () => {
    const reveal = computeAssistedPortalReveal({
      ...readyDecision,
      enabled: false,
      stage: "disabled",
      canRevealPortal: false,
      canSuggestReturn: false,
    });

    expect(reveal.integrated).toBe(true);
    expect(reveal.enabled).toBe(false);
    expect(reveal.revealPortalRing).toBe(false);
    expect(reveal.navigationEnabled).toBe(false);
  });

  it("reveals assisted portal affordance when enabled and ready", () => {
    const reveal = computeAssistedPortalReveal(readyDecision);

    expect(reveal.enabled).toBe(true);
    expect(reveal.revealPortalRing).toBe(true);
    expect(reveal.showReturnAffordance).toBe(true);
    expect(reveal.revealOpacity).toBeGreaterThan(0.5);
    expect(reveal.navigationEnabled).toBe(false);
  });

  it("requires confirmation and never navigates", () => {
    const affordance = computeAssistedReturnAffordance(computeAssistedPortalReveal(readyDecision));

    expect(affordance.visible).toBe(true);
    expect(affordance.confirmRequired).toBe(true);
    expect(affordance.navigationEnabled).toBe(false);
  });

  it("keeps visibility tuning gated", () => {
    const tuning = getAssistedVisibilityTuning();

    expect(tuning.softExposure).toBe(true);
    expect(tuning.disabledUntilFlag).toBe(true);
    expect(tuning.maxOpacity).toBeLessThanOrEqual(1);
  });

  it("mounts assisted portal reveal on FYP", () => {
    const page = fs.readFileSync("app/fyp/page.tsx", "utf8");
    const component = fs.readFileSync("components/fyp/GravityAssistedPortalReveal.tsx", "utf8");

    expect(page).toContain("GravityAssistedPortalReveal");
    expect(component).toContain("data-gravity-assisted-portal-reveal");
    expect(component).toContain('data-navigation-enabled="false"');
  });
});
