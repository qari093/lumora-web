import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  buildBridgeRuntime,
  buildDreamChamberRuntime,
  decideShadowRuntime,
  inferRuntimeConstellation,
  shouldEmitRuntimeSilentPulse
} from "@/src/core/creator-alchemy/constellation-runtime";

describe("Pack C — Constellation Runtime + Dream Chamber", () => {
  it("infers runtime constellation and drift", () => {
    const state = inferRuntimeConstellation({
      creatorId: "creator-c",
      toneShift: 0.55,
      audienceMutation: 0.65,
      creatorCuriosity: 0.5,
      rewatchDensity: 0.75
    });

    expect(state.constellation).toBe("Midnight Souls");
    expect(state.driftExposure).toBeGreaterThan(0.05);
    expect(state.shadowEligible).toBe(true);
  });

  it("builds Dream Chamber runtime with pre-glow", () => {
    const runtime = buildDreamChamberRuntime({
      constellation: "Midnight Souls",
      resonance: 0.8,
      daysUntilEvent: 2,
      activeNow: false
    });

    expect(runtime.preGlow).toBe(true);
    expect(runtime.likesHidden).toBe(true);
    expect(runtime.commentsHidden).toBe(true);
  });

  it("builds Bridge of Two Worlds runtime", () => {
    const bridge = buildBridgeRuntime("Midnight Souls", true);

    expect(bridge.active).toBe(true);
    expect(bridge.to).toBe("Neon Dreamers");
    expect(bridge.anonymous).toBe(true);
  });

  it("keeps Silent Pulse rare and optional", () => {
    expect(
      shouldEmitRuntimeSilentPulse({
        enabled: true,
        daysSinceLastPulse: 30,
        activeCreatorsInConstellation: 4,
        userDismissedPulse: false
      })
    ).toBe(true);

    expect(
      shouldEmitRuntimeSilentPulse({
        enabled: true,
        daysSinceLastPulse: 5,
        activeCreatorsInConstellation: 4,
        userDismissedPulse: false
      })
    ).toBe(false);
  });

  it("allows Shadow only when creator opted in and safety passed", () => {
    expect(
      decideShadowRuntime({
        creatorEligible: true,
        safetyPassed: true,
        creatorOptedIn: true
      }).allowed
    ).toBe(true);

    expect(
      decideShadowRuntime({
        creatorEligible: true,
        safetyPassed: true,
        creatorOptedIn: false
      }).allowed
    ).toBe(false);
  });

  it("creates constellation runtime API route", () => {
    expect(existsSync("app/api/creator-alchemy/constellation-runtime/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/constellation-runtime/route.ts", "utf8")).toContain("inferRuntimeConstellation");
  });

  it("creates Dream Chamber API route", () => {
    expect(existsSync("app/api/creator-alchemy/dream-chamber/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/dream-chamber/route.ts", "utf8")).toContain("buildDreamChamberRuntime");
  });
});
