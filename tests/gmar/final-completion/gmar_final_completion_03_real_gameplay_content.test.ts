import {
  GMAR_MISSION_REGISTRY,
  GMAR_PROGRESSION_CURVE,
  getGmarMission,
  getAvailableGmarMissions,
  calculateGmarLevelFromXp,
  assertGmarGameplayContent
} from "@/src/core/gmar/final-completion/gameplay/content";

describe("GMAR Final Completion Phase 03 — Real Gameplay Content", () => {
  it("locks mission registry", () => {
    expect(GMAR_MISSION_REGISTRY.length).toBeGreaterThanOrEqual(4);
    expect(getGmarMission("daily_origin_signal").tier).toBe("daily");
    expect(getGmarMission("story_first_gate").tier).toBe("story");
    expect(getGmarMission("event_origin_storm").zencoinReward).toBe(8);
  });

  it("filters missions by level", () => {
    const levelOne = getAvailableGmarMissions(1);
    const levelTwo = getAvailableGmarMissions(2);

    expect(levelOne.some(mission => mission.missionId === "weekly_squad_sync")).toBe(false);
    expect(levelTwo.some(mission => mission.missionId === "weekly_squad_sync")).toBe(true);
  });

  it("calculates progression from XP", () => {
    expect(GMAR_PROGRESSION_CURVE).toHaveLength(5);
    expect(calculateGmarLevelFromXp(0)).toBe(1);
    expect(calculateGmarLevelFromXp(100)).toBe(2);
    expect(calculateGmarLevelFromXp(250)).toBe(3);
    expect(calculateGmarLevelFromXp(900)).toBe(5);
  });

  it("asserts gameplay content seal", () => {
    expect(assertGmarGameplayContent()).toBe(true);
  });
});
