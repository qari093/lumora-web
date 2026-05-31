import type { SharedWorld, SharedWorldType } from "./types";

export function createSharedWorld(input: {
  id: string;
  type: SharedWorldType;
  title: string;
  ownerId: string;
}): SharedWorld {
  if (!input.id.trim()) throw new Error("world_id_required");
  if (!input.title.trim()) throw new Error("world_title_required");
  if (!input.ownerId.trim()) throw new Error("ownerId_required");

  return {
    id: input.id,
    type: input.type,
    title: input.title,
    ownerId: input.ownerId,
    members: [
      {
        citizenId: input.ownerId,
        role: "guardian",
        joinedAt: Date.now(),
        canInvite: true,
      },
    ],
    memoryIds: [],
    treeBloomIds: [],
    rituals: [],
    privateByDefault: true,
    active: true,
  };
}

export function addWorldRitual(world: SharedWorld, ritual: string): SharedWorld {
  if (!ritual.trim()) throw new Error("ritual_required");

  return {
    ...world,
    rituals: Array.from(new Set([...world.rituals, ritual])),
  };
}
