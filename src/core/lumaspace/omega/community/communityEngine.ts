import type {
  CommunityCivilization,
  CommunityDomain,
  CommunityIdentity,
  CommunityMember,
  CommunityRole,
} from "./types";

export function createCommunityIdentity(input: {
  communityId: string;
  name: string;
  domain: CommunityDomain;
  palette?: string;
  soundscape?: string;
  foundingStoryVideoId?: string;
}): CommunityIdentity {
  if (!input.communityId.trim()) throw new Error("communityId_required");
  if (!input.name.trim()) throw new Error("community_name_required");

  return {
    communityId: input.communityId,
    name: input.name,
    domain: input.domain,
    palette: input.palette ?? `${input.domain}_cosmic_palette`,
    soundscape: input.soundscape ?? `${input.domain}_ambient_loop`,
    foundingStoryVideoId: input.foundingStoryVideoId,
    lore: [],
    traditions: [],
  };
}

export function createCommunityCivilization(identity: CommunityIdentity): CommunityCivilization {
  return {
    identity,
    members: [],
    governance: {
      stewardIds: [],
      guardianIds: [],
      councilIds: [],
      constitutionAccepted: false,
      transparencyLogEnabled: true,
    },
    vaultMemoryIds: [],
    treeBloomIds: [],
    activeMissionIds: [],
    seed: false,
    verified: false,
  };
}

export function addCommunityMember(
  community: CommunityCivilization,
  member: CommunityMember,
): CommunityCivilization {
  if (!member.citizenId.trim()) throw new Error("citizenId_required");

  const existing = community.members.some((item) => item.citizenId === member.citizenId);
  if (existing) return community;

  return {
    ...community,
    members: [...community.members, member],
  };
}

export function promoteCommunityMember(
  community: CommunityCivilization,
  citizenId: string,
  role: CommunityRole,
): CommunityCivilization {
  const members = community.members.map((member) =>
    member.citizenId === citizenId ? { ...member, role } : member,
  );

  const governance = {
    ...community.governance,
    stewardIds: role === "steward"
      ? Array.from(new Set([...community.governance.stewardIds, citizenId]))
      : community.governance.stewardIds,
    guardianIds: role === "guardian"
      ? Array.from(new Set([...community.governance.guardianIds, citizenId]))
      : community.governance.guardianIds,
    councilIds: role === "council"
      ? Array.from(new Set([...community.governance.councilIds, citizenId]))
      : community.governance.councilIds,
  };

  return { ...community, members, governance };
}

export function addCommunityTradition(
  community: CommunityCivilization,
  tradition: string,
): CommunityCivilization {
  if (!tradition.trim()) throw new Error("tradition_required");

  return {
    ...community,
    identity: {
      ...community.identity,
      traditions: Array.from(new Set([...community.identity.traditions, tradition])),
    },
  };
}
