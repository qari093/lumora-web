import { describe, expect, it } from "vitest";
import { createSkillSignal, findComplementarySkills } from "@/src/core/lumaspace/omega/purpose/skillEngine";
import { canUsePurposeProfile, createPurposeProfile } from "@/src/core/lumaspace/omega/purpose/profileEngine";
import { createPurposeMatch, rankPurposeMatches } from "@/src/core/lumaspace/omega/purpose/matchingEngine";
import { advancePurposeMission, createPurposeMission } from "@/src/core/lumaspace/omega/purpose/missionEngine";
import { createPurposeReward } from "@/src/core/lumaspace/omega/purpose/rewardEngine";
import { runLumaSpaceOmegaMegaPack10Runtime } from "@/src/core/lumaspace/omega/purpose/omegaPack10Runtime";

describe("LumaSpace Ω∞ Mega Pack 10 — Purpose Bridges + Collaboration Matching", () => {
  it("creates valid skill signals", () => {
    const skill = createSkillSignal({
      id: "s1",
      citizenId: "u1",
      skill: "design",
      level: "advanced",
      offering: true,
      seeking: false,
    });

    expect(skill.skill).toBe("design");
  });

  it("finds complementary skills", () => {
    const a = [createSkillSignal({ id: "a", citizenId: "u1", skill: "code", level: "advanced", offering: true, seeking: false })];
    const b = [createSkillSignal({ id: "b", citizenId: "u2", skill: "code", level: "beginner", offering: false, seeking: true })];

    expect(findComplementarySkills(a, b)).toContain("code");
  });

  it("creates purpose profiles with consent", () => {
    const profile = createPurposeProfile({
      citizenId: "u1",
      modes: ["collaboration", "collaboration"],
      skills: [],
      missionDomains: ["creation", "creation"],
      availability: "medium",
      consentGranted: true,
    });

    expect(profile.modes).toEqual(["collaboration"]);
    expect(canUsePurposeProfile(profile)).toBe(true);
  });

  it("creates and ranks purpose matches", () => {
    const a = createPurposeProfile({
      citizenId: "u1",
      modes: ["collaboration"],
      skills: [createSkillSignal({ id: "a", citizenId: "u1", skill: "design", level: "advanced", offering: true, seeking: false })],
      missionDomains: ["creation"],
      availability: "high",
      consentGranted: true,
    });

    const b = createPurposeProfile({
      citizenId: "u2",
      modes: ["collaboration"],
      skills: [createSkillSignal({ id: "b", citizenId: "u2", skill: "design", level: "beginner", offering: false, seeking: true })],
      missionDomains: ["creation"],
      availability: "high",
      consentGranted: true,
    });

    const match = createPurposeMatch({ a, b, mode: "collaboration" });

    expect(match.matchScore).toBeGreaterThan(0);
    expect(rankPurposeMatches([match])[0].id).toBe(match.id);
  });

  it("creates and completes purpose mission", () => {
    const a = createPurposeProfile({
      citizenId: "u1",
      modes: ["mission_partner"],
      skills: [createSkillSignal({ id: "a", citizenId: "u1", skill: "writing", level: "advanced", offering: true, seeking: false })],
      missionDomains: ["learning"],
      availability: "high",
      consentGranted: true,
    });

    const b = createPurposeProfile({
      citizenId: "u2",
      modes: ["mission_partner"],
      skills: [createSkillSignal({ id: "b", citizenId: "u2", skill: "writing", level: "beginner", offering: false, seeking: true })],
      missionDomains: ["learning"],
      availability: "medium",
      consentGranted: true,
    });

    const match = createPurposeMatch({ a, b, mode: "mission_partner" });
    let mission = createPurposeMission({ match });
    mission = advancePurposeMission(mission, 100);

    expect(mission.progress).toBe(100);
    expect(mission.sharedMemoryId).toContain("shared_memory");
  });

  it("creates purpose reward", () => {
    const runtime = runLumaSpaceOmegaMegaPack10Runtime();

    expect(runtime.reward.unlocked).toBe(true);
    expect(runtime.reward.citizenIds).toEqual(["omega-a", "omega-b"]);
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack10Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.match.matchScore).toBeGreaterThan(0);
    expect(runtime.mission.progress).toBe(100);
    expect(runtime.reward.rewardKind).toBe("shared_memory");
  });
});
