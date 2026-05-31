import { describe, expect, it } from "vitest";
import { createEchoCircle, addCircleParticipant, startEchoCircle, completeEchoCircle } from "@/src/core/lumaspace/omega/echo-circles/circleEngine";
import { createCircleRitualPlan } from "@/src/core/lumaspace/omega/echo-circles/ritualEngine";
import { createCircleModerationSignal, circleCanContinue } from "@/src/core/lumaspace/omega/echo-circles/moderationEngine";
import { createCircleBloom } from "@/src/core/lumaspace/omega/echo-circles/bloomEngine";
import { runLumaSpaceOmegaMegaPack12Runtime } from "@/src/core/lumaspace/omega/echo-circles/omegaPack12Runtime";

describe("LumaSpace Ω∞ Mega Pack 12 — Echo Circles", () => {
  it("creates no-log Echo Circle", () => {
    const circle = createEchoCircle({
      id: "c1",
      theme: "hope",
      hostId: "h1",
    });

    expect(circle.noLogs).toBe(true);
    expect(circle.recordingDisabled).toBe(true);
    expect(circle.durationMinutes).toBe(10);
  });

  it("adds participants and starts circle", () => {
    let circle = createEchoCircle({
      id: "c2",
      theme: "focus",
      hostId: "h1",
    });

    circle = addCircleParticipant(circle, "u1");
    circle = addCircleParticipant(circle, "u2");
    circle = addCircleParticipant(circle, "u3");
    circle = startEchoCircle(circle);

    expect(circle.status).toBe("active");
    expect(circle.participants).toHaveLength(3);
  });

  it("completes active circle", () => {
    let circle = createEchoCircle({
      id: "c3",
      theme: "gratitude",
      hostId: "h1",
    });

    circle = addCircleParticipant(circle, "u1");
    circle = addCircleParticipant(circle, "u2");
    circle = addCircleParticipant(circle, "u3");
    circle = startEchoCircle(circle);

    expect(completeEchoCircle(circle).status).toBe("completed");
  });

  it("creates ritual plan", () => {
    const circle = createEchoCircle({
      id: "c4",
      theme: "starting_over",
      hostId: "h1",
    });

    const ritual = createCircleRitualPlan(circle);

    expect(ritual.openingPrompt).toContain("No performance");
    expect(ritual.totalMinutes).toBe(10);
  });

  it("creates moderation signal", () => {
    const low = createCircleModerationSignal({
      circleId: "c5",
      severity: "low",
      reason: "safe",
    });

    const high = createCircleModerationSignal({
      circleId: "c5",
      severity: "high",
      reason: "unsafe",
    });

    expect(low.requiresGuardianReview).toBe(false);
    expect(circleCanContinue([low])).toBe(true);
    expect(circleCanContinue([high])).toBe(false);
  });

  it("creates private circle bloom", () => {
    const bloom = createCircleBloom({
      citizenId: "u1",
      circleId: "c6",
      theme: "creative_fire",
    });

    expect(bloom.privateByDefault).toBe(true);
    expect(bloom.bloomShape).toBe("spiral");
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack12Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.circle.status).toBe("active");
    expect(runtime.completed.status).toBe("completed");
    expect(runtime.bloom.privateByDefault).toBe(true);
  });
});
