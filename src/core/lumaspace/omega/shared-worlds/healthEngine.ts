import type { SharedWorld, SharedWorldHealth } from "./types";

export function calculateSharedWorldHealth(world: SharedWorld): SharedWorldHealth {
  const memberCount = world.members.length;
  const memoryCount = world.memoryIds.length;
  const ritualCount = world.rituals.length;

  const healthScore = Math.min(
    100,
    memberCount * 12 + memoryCount * 10 + ritualCount * 8 + (world.active ? 10 : 0),
  );

  return {
    worldId: world.id,
    memberCount,
    memoryCount,
    ritualCount,
    healthScore,
  };
}
