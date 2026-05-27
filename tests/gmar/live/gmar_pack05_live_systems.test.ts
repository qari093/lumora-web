import { describe, it, expect } from "vitest";

import { aiDirector } from "../../../src/core/gmar/ai/aiDirector";
import { resolveStory } from "../../../src/core/gmar/narrative/storyEngine";
import { createMatch } from "../../../src/core/gmar/multiplayer/liveMatch";
import { spectatorMode } from "../../../src/core/gmar/multiplayer/spectatorMode";
import { claimReward } from "../../../src/core/gmar/events/eventRewards";

describe("GMAR PACK 5", () => {
  it("controls ai director", () => {
    expect(aiDirector(3).enemyMultiplier).toBe(6);
  });

  it("resolves story", () => {
    expect(resolveStory("chaos").outcome).toContain("chaos");
  });

  it("creates multiplayer match", () => {
    expect(createMatch(4).ready).toBe(true);
  });

  it("supports spectators", () => {
    expect(spectatorMode(100).viewers).toBe(100);
  });

  it("claims rewards", () => {
    expect(claimReward(100).claimed).toBe(true);
  });
});
