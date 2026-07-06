import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  getNextQuest,
  getQuestProgress,
  getReactionLabel,
  identityQuests,
  reactionStars
} from "@/src/core/lumaspace/evolution/runtime";

describe("LumaSpace Ω∞ Mega Pack 05 — Identity Quests & Reaction Galaxy", () => {
  it("locks identity quests as earned aura paths", () => {
    expect(identityQuests.length).toBeGreaterThanOrEqual(3);
    expect(getQuestProgress(identityQuests[0])).toBeGreaterThan(0);
    expect(getNextQuest()?.reward).toContain("Aura");
  });

  it("locks reaction galaxy without toxic metrics", () => {
    expect(reactionStars.length).toBeGreaterThanOrEqual(5);
    expect(getReactionLabel("wonder")).toBe("Wonder");
    expect(JSON.stringify(reactionStars)).not.toMatch(/likes|followers|views|rank/i);
  });

  it("creates canonical evolution UI surface", () => {
    expect(fs.existsSync("src/core/lumaspace/evolution/runtime.ts")).toBe(true);
    expect(fs.existsSync("src/components/lumaspace/evolution/LumaEvolution.tsx")).toBe(true);
  });

  it("mounts evolution into LumaSpace page", () => {
    const page = fs.readFileSync("app/lumaspace/page.tsx", "utf8");
    expect(page).toContain("LivingUniverseRuntime");
  });
});
