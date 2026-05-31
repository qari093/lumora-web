import type { CommunityCivilization } from "./types";

export type CommunityHealth = {
  communityId: string;
  memberCount: number;
  guardianCount: number;
  memoryCount: number;
  missionCount: number;
  trustAverage: number;
  healthScore: number;
};

export function calculateCommunityHealth(community: CommunityCivilization): CommunityHealth {
  const memberCount = community.members.length;
  const trustAverage = memberCount === 0
    ? 0
    : Math.round(community.members.reduce((sum, member) => sum + member.trust, 0) / memberCount);

  const guardianCount = community.governance.guardianIds.length + community.governance.councilIds.length;
  const memoryCount = community.vaultMemoryIds.length;
  const missionCount = community.activeMissionIds.length;

  const healthScore = Math.min(
    100,
    Math.round(
      trustAverage * 0.35 +
      Math.min(25, memberCount * 2) +
      guardianCount * 10 +
      Math.min(15, memoryCount * 3) +
      Math.min(15, missionCount * 5),
    ),
  );

  return {
    communityId: community.identity.communityId,
    memberCount,
    guardianCount,
    memoryCount,
    missionCount,
    trustAverage,
    healthScore,
  };
}
