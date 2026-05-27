import { describe, expect, it } from "vitest";

import {
  createSynchronicityFlare,
  flareUrgencyLevel
} from "@/src/core/fyp/flares/flareEngine";

import {
  createFlareWindow,
  isFlareWindowActive
} from "@/src/core/fyp/flares/flareWindow";

import {
  preserveFlareMemory
} from "@/src/core/fyp/flares/sharedMemory";

import {
  createEmotionalHotDrop
} from "@/src/core/fyp/hot-drops/hotDrop";

import {
  createCollectiveBadge
} from "@/src/core/fyp/hot-drops/collectiveBadge";

describe("Lumora FYP Synchronicity Flares + Hot Drops", () => {
  it("creates synchronicity flare", () => {
    const flare = createSynchronicityFlare({
      mode: "chaos",
      participants: ["a", "b", "c", "d"],
      collectiveEnergy: 950,
      now: 100
    });

    expect(flare.active).toBe(true);
    expect(flareUrgencyLevel(flare)).toBe("critical");
  });

  it("creates active flare window", () => {
    const flare = createSynchronicityFlare({
      mode: "drift",
      participants: ["a", "b", "c"],
      collectiveEnergy: 500,
      now: 100
    });

    const window = createFlareWindow(flare);

    expect(
      isFlareWindowActive({
        window,
        now: 101
      })
    ).toBe(true);
  });

  it("preserves flare memory", () => {
    const flare = createSynchronicityFlare({
      mode: "deep",
      participants: ["a", "b", "c", "d"],
      collectiveEnergy: 700,
      now: 100
    });

    const memory = preserveFlareMemory(flare);

    expect(memory.preservedParticipants).toBe(4);
    expect(memory.emotionalIntensity).toBe(700);
  });

  it("creates emotional hot drop", () => {
    const drop = createEmotionalHotDrop({
      mode: "chaos",
      countdownSeconds: 90,
      participants: 1200
    });

    expect(drop.synchronized).toBe(true);
    expect(drop.liveTrackGenerated).toBe(true);
  });

  it("creates collective badge", () => {
    const drop = createEmotionalHotDrop({
      mode: "chaos",
      countdownSeconds: 90,
      participants: 1200
    });

    const badge = createCollectiveBadge(drop);

    expect(badge.rarity).toBe("legendary");
  });
});
