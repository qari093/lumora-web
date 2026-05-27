import type {
  RivalryArena,
  VoltRivalry
} from "./types";

export function createRivalryArena(
  rivalry: VoltRivalry
): RivalryArena {
  return {
    arenaId: `arena_${rivalry.rivalryId}`,
    rivalryId: rivalry.rivalryId,
    viewers: 0,
    active: true
  };
}

export function addArenaViewers(input: {
  arena: RivalryArena;
  viewers: number;
}): RivalryArena {
  return {
    ...input.arena,
    viewers: input.arena.viewers + input.viewers
  };
}
