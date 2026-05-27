import type { GmarGameState } from "@/src/core/gmar/state/gameState";

export type GmarFriend = {
  playerId: string;
  displayName: string;
  online: boolean;
};

export type GmarSquad = {
  squadId: string;
  name: string;
  members: string[];
  sharedMissionId: string | null;
};

export type GmarLeaderboardEntry = {
  playerId: string;
  displayName: string;
  xp: number;
  rank: number;
};

export type GmarSocialState = {
  friends: GmarFriend[];
  squads: GmarSquad[];
  leaderboard: GmarLeaderboardEntry[];
  liveRoomEnabled: boolean;
};

export const DEFAULT_GMAR_SOCIAL_STATE: GmarSocialState = {
  friends: [],
  squads: [],
  leaderboard: [],
  liveRoomEnabled: true
};

export function createGmarSquad(input: {
  squadId: string;
  name: string;
  ownerPlayerId: string;
}): GmarSquad {
  const squadId = input.squadId.trim();
  const name = input.name.trim();
  const ownerPlayerId = input.ownerPlayerId.trim();

  if (!squadId || !name || !ownerPlayerId) {
    throw new Error("GMAR squad creation requires valid values.");
  }

  return {
    squadId,
    name,
    members: [ownerPlayerId],
    sharedMissionId: null
  };
}

export function joinGmarSquad(input: {
  squad: GmarSquad;
  playerId: string;
}): GmarSquad {
  const playerId = input.playerId.trim();

  if (!playerId) {
    throw new Error("GMAR squad join requires playerId.");
  }

  if (input.squad.members.includes(playerId)) {
    throw new Error("GMAR player already in squad.");
  }

  return {
    ...input.squad,
    members: [...input.squad.members, playerId]
  };
}

export function createLeaderboardEntry(input: {
  state: GmarGameState;
  rank: number;
}): GmarLeaderboardEntry {
  return {
    playerId: input.state.player.playerId,
    displayName: input.state.player.displayName,
    xp: input.state.player.xp,
    rank: input.rank
  };
}

export function assertGmarSocialState(input: {
  squad: GmarSquad;
  leaderboard: GmarLeaderboardEntry;
}): true {
  if (
    input.squad.members.length < 1 ||
    !input.leaderboard.playerId ||
    input.leaderboard.rank < 1
  ) {
    throw new Error("Invalid GMAR social state.");
  }

  return true;
}
