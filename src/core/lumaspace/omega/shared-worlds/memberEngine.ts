import type { SharedWorld, SharedWorldMember, SharedWorldRole } from "./types";

export function addSharedWorldMember(
  world: SharedWorld,
  citizenId: string,
  role: SharedWorldRole = "member",
): SharedWorld {
  if (!citizenId.trim()) throw new Error("citizenId_required");
  if (world.members.some((member) => member.citizenId === citizenId)) return world;

  const member: SharedWorldMember = {
    citizenId,
    role,
    joinedAt: Date.now(),
    canInvite: role === "steward" || role === "guardian",
  };

  return {
    ...world,
    members: [...world.members, member],
  };
}

export function promoteSharedWorldMember(
  world: SharedWorld,
  citizenId: string,
  role: SharedWorldRole,
): SharedWorld {
  return {
    ...world,
    members: world.members.map((member) =>
      member.citizenId === citizenId
        ? { ...member, role, canInvite: role === "steward" || role === "guardian" }
        : member,
    ),
  };
}

export function canInviteToSharedWorld(world: SharedWorld, citizenId: string): boolean {
  return world.members.some((member) => member.citizenId === citizenId && member.canInvite);
}
