import { describe, expect, it } from "vitest";
import { addFestivalContribution, completeFestival, createFestivalOfStars, createFestivalReward, startFestival } from "@/src/core/lumaspace/omega/festival/festivalEngine";
import { runLumaSpaceOmegaMegaPack18Runtime } from "@/src/core/lumaspace/omega/festival/omegaPack18Runtime";

describe("LumaSpace Ω∞ Mega Pack 18 — Festival of Stars", () => {
  it("runs festival lifecycle", () => {
    let festival = startFestival(createFestivalOfStars({ id: "f1", title: "Festival", globalMissionId: "g1" }));
    const out = addFestivalContribution({ festival, citizenId: "u1", lightAmount: 3 });
    festival = completeFestival(out.festival);

    expect(festival.status).toBe("completed");
    expect(createFestivalReward(out.contribution).reward).toBe("festival_bloom");
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack18Runtime().ok).toBe(true);
  });
});
