import { describe, expect, it } from "vitest";
import { createWisdomBeacon, beaconIsDiscoverable } from "@/src/core/lumaspace/omega/wisdom/beaconEngine";
import { searchWisdomBeacons } from "@/src/core/lumaspace/omega/wisdom/discoveryEngine";
import { applyGratitudeToBeacon, sendGratitudeGem } from "@/src/core/lumaspace/omega/wisdom/gratitudeEngine";
import { createWisdomChallenge, completeWisdomChallenge } from "@/src/core/lumaspace/omega/wisdom/challengeEngine";
import { createWisdomReward } from "@/src/core/lumaspace/omega/wisdom/rewardEngine";
import { runLumaSpaceOmegaMegaPack13Runtime } from "@/src/core/lumaspace/omega/wisdom/omegaPack13Runtime";

describe("LumaSpace Ω∞ Mega Pack 13 — Wisdom Beacon Network", () => {
  it("creates discoverable human wisdom beacon", () => {
    const beacon = createWisdomBeacon({
      id: "b1",
      authorId: "g1",
      topic: "building",
      format: "text",
      title: "Build small",
      body: "Start with one small honest action.",
      humanRecorded: true,
      trustScore: 85,
      appreciationCount: 0,
      visibility: "public",
    });

    expect(beaconIsDiscoverable(beacon)).toBe(true);
  });

  it("searches wisdom beacons", () => {
    const beacon = createWisdomBeacon({
      id: "b2",
      authorId: "g1",
      topic: "creative_block",
      format: "audio",
      title: "Move gently",
      body: "Creative block softens when you lower the pressure.",
      humanRecorded: true,
      trustScore: 90,
      appreciationCount: 2,
      visibility: "public",
    });

    expect(searchWisdomBeacons({ beacons: [beacon], topic: "creative_block", query: "pressure" })).toHaveLength(1);
  });

  it("sends gratitude gem and applies appreciation", () => {
    const beacon = createWisdomBeacon({
      id: "b3",
      authorId: "g1",
      topic: "discipline",
      format: "video",
      title: "Discipline",
      body: "Repeat the smallest useful action.",
      humanRecorded: true,
      trustScore: 80,
      appreciationCount: 0,
      visibility: "public",
    });

    const gem = sendGratitudeGem({
      fromCitizenId: "u1",
      beacon,
      message: "Thanks",
    });

    const updated = applyGratitudeToBeacon(beacon);

    expect(gem.zencoinMicroReward).toBe(1);
    expect(updated.appreciationCount).toBe(1);
  });

  it("creates and completes wisdom challenge", () => {
    const challenge = createWisdomChallenge({
      id: "ch1",
      topic: "starting_over",
      prompt: "What did starting over teach you?",
    });

    expect(challenge.rewardCosmetic).toBe("lamp_of_wisdom");
    expect(completeWisdomChallenge({ challenge, appreciationCount: 5 })).toBe(true);
  });

  it("creates wisdom reward", () => {
    const beacon = createWisdomBeacon({
      id: "b4",
      authorId: "g1",
      topic: "learning",
      format: "text",
      title: "Learning",
      body: "Learn by returning with patience.",
      humanRecorded: true,
      trustScore: 80,
      appreciationCount: 5,
      visibility: "public",
    });

    const challenge = createWisdomChallenge({
      id: "ch2",
      topic: "learning",
      prompt: "What helped you learn?",
    });

    const reward = createWisdomReward({ beacon, challenge });

    expect(reward.unlocked).toBe(true);
    expect(reward.rewardKind).toBe("lamp_of_wisdom");
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack13Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.discovered).toHaveLength(1);
    expect(runtime.reward.rewardKind).toBe("lamp_of_wisdom");
  });
});
