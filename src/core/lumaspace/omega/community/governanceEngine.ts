import type { CommunityCivilization } from "./types";

export type GovernanceAction = {
  id: string;
  communityId: string;
  actorId: string;
  action:
    | "constitution_accept"
    | "member_promote"
    | "mission_approve"
    | "memory_preserve"
    | "moderation_review";
  transparent: boolean;
  createdAt: number;
};

export function acceptCommunityConstitution(
  community: CommunityCivilization,
): CommunityCivilization {
  return {
    ...community,
    governance: {
      ...community.governance,
      constitutionAccepted: true,
      transparencyLogEnabled: true,
    },
  };
}

export function createGovernanceAction(input: {
  communityId: string;
  actorId: string;
  action: GovernanceAction["action"];
}): GovernanceAction {
  if (!input.communityId.trim()) throw new Error("communityId_required");
  if (!input.actorId.trim()) throw new Error("actorId_required");

  return {
    id: `gov_${input.communityId}_${input.action}_${Date.now()}`,
    communityId: input.communityId,
    actorId: input.actorId,
    action: input.action,
    transparent: true,
    createdAt: Date.now(),
  };
}

export function canGovernCommunity(
  community: CommunityCivilization,
  citizenId: string,
): boolean {
  return (
    community.governance.stewardIds.includes(citizenId) ||
    community.governance.guardianIds.includes(citizenId) ||
    community.governance.councilIds.includes(citizenId)
  );
}
