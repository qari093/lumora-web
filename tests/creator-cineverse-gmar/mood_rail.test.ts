import { describe, expect, it } from "vitest";
import { createMoodRail } from "@/lib/cineverse/moodRailEngine";

describe("mood rail", () => {
  it("creates cinematic mood rail", () => {
    const rail = createMoodRail("cosmic", 5);

    expect(rail.entries).toBe(5);
    expect(rail.completionReward).toContain("theme");
  });
});
