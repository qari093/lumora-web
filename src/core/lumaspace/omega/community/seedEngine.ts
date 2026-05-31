import type { ConstellationSeed, WisdomBeaconSeed } from "./types";
import { createCommunityCivilization, createCommunityIdentity, addCommunityMember, addCommunityTradition } from "./communityEngine";
import { acceptCommunityConstitution } from "./governanceEngine";
import { addCommunityMemory, attachCommunityMission } from "./communityMemory";

export function createConstellationSeed(input: {
  communityId: string;
  name: string;
  ambassadors: string[];
  foundingStoryVideoId: string;
  wisdomBeacons: WisdomBeaconSeed[];
  starterMissionIds: string[];
  starterMemoryIds: string[];
}): ConstellationSeed {
  if (input.ambassadors.length < 3) throw new Error("at_least_three_ambassadors_required");
  if (!input.foundingStoryVideoId.trim()) throw new Error("founding_story_video_required");
  if (input.wisdomBeacons.filter((beacon) => beacon.humanRecorded).length < 3) {
    throw new Error("three_human_wisdom_beacons_required");
  }

  let community = createCommunityCivilization(
    createCommunityIdentity({
      communityId: input.communityId,
      name: input.name,
      domain: "builder",
      foundingStoryVideoId: input.foundingStoryVideoId,
    }),
  );

  community = acceptCommunityConstitution(community);
  community = addCommunityTradition(community, "First Light Welcome");
  community = addCommunityTradition(community, "Weekly Reflection Circle");

  input.ambassadors.forEach((ambassador, index) => {
    community = addCommunityMember(community, {
      citizenId: ambassador,
      role: index === 0 ? "guardian" : "steward",
      trust: 90,
      contribution: 75,
      joinedAt: Date.now(),
    });
  });

  input.starterMemoryIds.forEach((memoryId) => {
    community = addCommunityMemory(community, memoryId);
  });

  input.starterMissionIds.forEach((missionId) => {
    community = attachCommunityMission(community, missionId);
  });

  community = {
    ...community,
    seed: true,
    verified: true,
    governance: {
      ...community.governance,
      stewardIds: input.ambassadors.slice(1),
      guardianIds: [input.ambassadors[0]],
    },
  };

  return {
    community,
    ambassadors: input.ambassadors,
    wisdomBeacons: input.wisdomBeacons,
    starterMissionIds: input.starterMissionIds,
    starterMemoryIds: input.starterMemoryIds,
  };
}

export function validateConstellationSeed(seed: ConstellationSeed): boolean {
  return (
    seed.community.seed &&
    seed.community.verified &&
    seed.ambassadors.length >= 3 &&
    Boolean(seed.community.identity.foundingStoryVideoId) &&
    seed.wisdomBeacons.filter((beacon) => beacon.humanRecorded).length >= 3 &&
    seed.starterMissionIds.length > 0 &&
    seed.starterMemoryIds.length > 0
  );
}
