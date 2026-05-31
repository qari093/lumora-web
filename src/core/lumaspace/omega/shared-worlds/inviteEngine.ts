import type { SharedWorld, SharedWorldInvite } from "./types";
import { addSharedWorldMember, canInviteToSharedWorld } from "./memberEngine";

export function createSharedWorldInvite(input: {
  world: SharedWorld;
  invitedBy: string;
  invitedCitizenId: string;
}): SharedWorldInvite {
  if (!canInviteToSharedWorld(input.world, input.invitedBy)) throw new Error("invite_permission_denied");
  if (!input.invitedCitizenId.trim()) throw new Error("invitedCitizenId_required");

  return {
    id: `world_invite_${input.world.id}_${input.invitedCitizenId}`,
    worldId: input.world.id,
    invitedBy: input.invitedBy,
    invitedCitizenId: input.invitedCitizenId,
    status: "pending",
  };
}

export function acceptSharedWorldInvite(
  world: SharedWorld,
  invite: SharedWorldInvite,
): { world: SharedWorld; invite: SharedWorldInvite } {
  if (invite.worldId !== world.id) throw new Error("invite_world_mismatch");

  return {
    world: addSharedWorldMember(world, invite.invitedCitizenId, "member"),
    invite: { ...invite, status: "accepted" },
  };
}
