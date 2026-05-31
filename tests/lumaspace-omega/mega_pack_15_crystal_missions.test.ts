import { describe, expect, it } from "vitest";
import { createCrystalMission, activateMission } from "@/src/core/lumaspace/omega/crystal-missions/missionEngine";
import { applyMissionContribution, createMissionContribution, missionProgressPercent } from "@/src/core/lumaspace/omega/crystal-missions/progressEngine";
import { distributeMissionRewards } from "@/src/core/lumaspace/omega/crystal-missions/rewardEngine";
import { runLumaSpaceOmegaMegaPack15Runtime } from "@/src/core/lumaspace/omega/crystal-missions/omegaPack15Runtime";

describe("LumaSpace Ω∞ Mega Pack 15 — Crystal Missions", () => {
  it("creates and activates mission", () => {
    const mission = activateMission(createCrystalMission({
      id: "m1",
      communityId: "c1",
      title: "Kindness",
      kind: "kindness",
      target: 10,
    }));
    expect(mission.status).toBe("active");
  });

  it("applies progress and completes mission", () => {
    let mission = activateMission(createCrystalMission({
      id: "m2",
      communityId: "c1",
      title: "Progress",
      kind: "community",
      target: 10,
    }));

    mission = applyMissionContribution(mission, createMissionContribution({
      missionId: "m2",
      citizenId: "u1",
      amount: 10,
    }));

    expect(mission.status).toBe("completed");
    expect(missionProgressPercent(mission)).toBe(100);
  });

  it("distributes rewards", () => {
    const runtime = runLumaSpaceOmegaMegaPack15Runtime();
    expect(runtime.rewards).toHaveLength(2);
    expect(runtime.rewards[0].zencoinAmount).toBe(150);
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack15Runtime().ok).toBe(true);
  });
});
