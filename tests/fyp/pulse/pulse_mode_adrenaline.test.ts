import { describe, expect, it } from "vitest";

import {
  calculateVoltageScore
} from "@/src/core/fyp/voltage/voltageScore";

import {
  createPulseModeSession,
  assertPulseSessionActive
} from "@/src/core/fyp/pulse/pulseMode";

import {
  injectPulseContent
} from "@/src/core/fyp/pulse/pulseInjection";

import {
  createPulseSequence
} from "@/src/core/fyp/pulse/pulseSequence";

import {
  calculateAdrenalineLimiter
} from "@/src/core/fyp/voltage/adrenalineLimiter";

describe("Lumora FYP Pulse Mode + Adrenaline", () => {
  const items = [
    {
      id: "a",
      creatorId: "c1",
      mode: "chaos" as const,
      intensity: 9,
      replayWeight: 20,
      novelty: 70,
      createdAt: 1
    },
    {
      id: "b",
      creatorId: "c2",
      mode: "energy" as const,
      intensity: 8,
      replayWeight: 18,
      novelty: 60,
      createdAt: 2
    },
    {
      id: "c",
      creatorId: "c3",
      mode: "wonder" as const,
      intensity: 7,
      replayWeight: 14,
      novelty: 80,
      createdAt: 3
    }
  ];

  it("calculates voltage score", () => {
    const score = calculateVoltageScore({
      instantReplayRate: 90,
      scrollStopRate: 70,
      shareVelocity: 80,
      firstSixSecondRetention: 88
    });

    expect(score.tier).toBe("nuclear");
  });

  it("creates active pulse session", () => {
    const session = createPulseModeSession({
      userId: "waqar",
      mode: "chaos",
      now: 100
    });

    expect(
      assertPulseSessionActive(session, 150)
    ).toBe(true);
  });

  it("injects pulse content", () => {
    const injections = injectPulseContent({
      items,
      now: 100
    });

    expect(injections.length).toBe(3);
    expect(injections[0].voltage).toBeGreaterThan(0);
  });

  it("creates pulse sequence", () => {
    const sequence = createPulseSequence({
      mode: "chaos",
      items
    });

    expect(sequence.durationSeconds).toBeGreaterThan(0);
    expect(sequence.items[0].intensity).toBe(9);
  });

  it("limits adrenaline overload", () => {
    const limiter = calculateAdrenalineLimiter({
      recentPulseMinutes: 25,
      averageIntensity: 9
    });

    expect(limiter.overloadRisk).toBe(true);
    expect(limiter.cooldownRequired).toBe(true);
  });
});
