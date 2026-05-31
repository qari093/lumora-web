import { describe, expect, it } from "vitest";
import { createCommunityCivilization, createCommunityIdentity, addCommunityMember, promoteCommunityMember, addCommunityTradition } from "@/src/core/lumaspace/omega/community/communityEngine";
import { acceptCommunityConstitution, canGovernCommunity, createGovernanceAction } from "@/src/core/lumaspace/omega/community/governanceEngine";
import { addCommunityMemory, addCommunityTreeBloom, attachCommunityMission } from "@/src/core/lumaspace/omega/community/communityMemory";
import { calculateCommunityHealth } from "@/src/core/lumaspace/omega/community/reputationEngine";
import { createConstellationSeed, validateConstellationSeed } from "@/src/core/lumaspace/omega/community/seedEngine";
import { runLumaSpaceOmegaMegaPack04Runtime } from "@/src/core/lumaspace/omega/community/omegaPack04Runtime";

describe("LumaSpace Ω∞ Mega Pack 04 — Community Civilizations + Constellation Seeds", () => {
  it("creates community identity and civilization", () => {
    const identity = createCommunityIdentity({
      communityId: "c1",
      name: "Creators",
      domain: "creator",
    });

    const community = createCommunityCivilization(identity);

    expect(community.identity.palette).toBe("creator_cosmic_palette");
    expect(community.members).toHaveLength(0);
    expect(community.governance.transparencyLogEnabled).toBe(true);
  });

  it("adds members and promotes guardians", () => {
    let community = createCommunityCivilization(
      createCommunityIdentity({ communityId: "c2", name: "Builders", domain: "builder" }),
    );

    community = addCommunityMember(community, {
      citizenId: "u1",
      role: "citizen",
      trust: 90,
      contribution: 80,
      joinedAt: 1,
    });

    community = promoteCommunityMember(community, "u1", "guardian");

    expect(community.members[0].role).toBe("guardian");
    expect(community.governance.guardianIds).toContain("u1");
  });

  it("accepts constitution and creates transparent governance action", () => {
    let community = createCommunityCivilization(
      createCommunityIdentity({ communityId: "c3", name: "Wellness", domain: "wellness" }),
    );

    community = acceptCommunityConstitution(community);
    const action = createGovernanceAction({
      communityId: "c3",
      actorId: "u2",
      action: "memory_preserve",
    });

    expect(community.governance.constitutionAccepted).toBe(true);
    expect(action.transparent).toBe(true);
  });

  it("adds traditions, memories, blooms and missions", () => {
    let community = createCommunityCivilization(
      createCommunityIdentity({ communityId: "c4", name: "Learning", domain: "learning" }),
    );

    community = addCommunityTradition(community, "Monday Learning Circle");
    community = addCommunityMemory(community, "m1");
    community = addCommunityTreeBloom(community, "b1");
    community = attachCommunityMission(community, "mission1");

    expect(community.identity.traditions).toContain("Monday Learning Circle");
    expect(community.vaultMemoryIds).toContain("m1");
    expect(community.treeBloomIds).toContain("b1");
    expect(community.activeMissionIds).toContain("mission1");
  });

  it("calculates community health", () => {
    let community = createCommunityCivilization(
      createCommunityIdentity({ communityId: "c5", name: "Trust", domain: "local" }),
    );

    community = addCommunityMember(community, {
      citizenId: "u1",
      role: "citizen",
      trust: 90,
      contribution: 70,
      joinedAt: 1,
    });
    community = promoteCommunityMember(community, "u1", "guardian");
    community = addCommunityMemory(community, "m1");
    community = attachCommunityMission(community, "mission1");

    const health = calculateCommunityHealth(community);

    expect(health.guardianCount).toBe(1);
    expect(health.healthScore).toBeGreaterThan(50);
  });

  it("creates and validates constellation seed with ambassadors", () => {
    const seed = createConstellationSeed({
      communityId: "seed1",
      name: "Seed Builders",
      ambassadors: ["a1", "a2", "a3"],
      foundingStoryVideoId: "video1",
      wisdomBeacons: [
        { id: "w1", recordedBy: "a1", topic: "start", humanRecorded: true },
        { id: "w2", recordedBy: "a2", topic: "build", humanRecorded: true },
        { id: "w3", recordedBy: "a3", topic: "care", humanRecorded: true },
      ],
      starterMissionIds: ["mission1"],
      starterMemoryIds: ["memory1"],
    });

    expect(validateConstellationSeed(seed)).toBe(true);
    expect(seed.community.verified).toBe(true);
    expect(seed.community.identity.foundingStoryVideoId).toBe("video1");
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack04Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.community.identity.name).toBe("LumaSpace Builders");
    expect(runtime.seed.community.seed).toBe(true);
    expect(runtime.health.healthScore).toBeGreaterThan(50);
  });
});
