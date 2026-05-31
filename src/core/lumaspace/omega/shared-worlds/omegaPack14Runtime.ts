import { createSharedWorld, addWorldRitual } from "./worldEngine";
import { addSharedWorldMember, promoteSharedWorldMember, canInviteToSharedWorld } from "./memberEngine";
import { createSharedWorldInvite, acceptSharedWorldInvite } from "./inviteEngine";
import { addSharedWorldMemory, addSharedWorldBloom } from "./memoryEngine";
import { calculateSharedWorldHealth } from "./healthEngine";

export function runLumaSpaceOmegaMegaPack14Runtime() {
  let world = createSharedWorld({
    id: "world-014",
    type: "creator",
    title: "Creator Hearth",
    ownerId: "owner-014",
  });

  world = addSharedWorldMember(world, "builder-014", "builder");
  world = promoteSharedWorldMember(world, "builder-014", "steward");
  world = addWorldRitual(world, "Sunday Creation Circle");

  const invite = createSharedWorldInvite({
    world,
    invitedBy: "builder-014",
    invitedCitizenId: "member-014",
  });

  const accepted = acceptSharedWorldInvite(world, invite);
  world = accepted.world;

  world = addSharedWorldMemory(world, "memory-014");
  world = addSharedWorldBloom(world, "bloom-014");

  const health = calculateSharedWorldHealth(world);

  return {
    ok:
      world.privateByDefault &&
      world.members.length === 3 &&
      canInviteToSharedWorld(world, "builder-014") &&
      accepted.invite.status === "accepted" &&
      world.memoryIds.includes("memory-014") &&
      world.treeBloomIds.includes("bloom-014") &&
      health.healthScore > 40,
    world,
    invite,
    accepted,
    health,
  };
}
