export type GmarMatchType =
  | "pve"
  | "pvp"
  | "event"
  | "squad";

export type GmarMatchmakingQueue = {
  queueId: string;
  type: GmarMatchType;
  players: string[];
  maxPlayers: number;
  fairnessRulesReady: true;
  telemetryReady: true;
};

export type GmarSession = {
  sessionId: string;
  type: GmarMatchType;
  players: string[];
  active: boolean;
  recoveryReady: true;
  timeoutReady: true;
  createdAt: string;
};

export function createGmarMatchmakingQueue(input: {
  queueId: string;
  type: GmarMatchType;
}): GmarMatchmakingQueue {
  const queueId = input.queueId.trim();

  if (!queueId) {
    throw new Error("GMAR matchmaking queueId is required.");
  }

  return {
    queueId,
    type: input.type,
    players: [],
    maxPlayers: input.type === "event" ? 20 : 4,
    fairnessRulesReady: true,
    telemetryReady: true
  };
}

export function enqueueGmarPlayer(input: {
  queue: GmarMatchmakingQueue;
  playerId: string;
}): GmarMatchmakingQueue {
  const playerId = input.playerId.trim();

  if (!playerId) {
    throw new Error("GMAR matchmaking playerId is required.");
  }

  if (input.queue.players.includes(playerId)) {
    throw new Error("GMAR player already queued.");
  }

  if (input.queue.players.length >= input.queue.maxPlayers) {
    throw new Error("GMAR matchmaking queue is full.");
  }

  return {
    ...input.queue,
    players: [...input.queue.players, playerId]
  };
}

export function createGmarSession(input: {
  queue: GmarMatchmakingQueue;
  now?: Date;
}): GmarSession {
  if (input.queue.players.length < 2) {
    throw new Error("GMAR matchmaking requires at least 2 players.");
  }

  return {
    sessionId: `gmar_session_${input.queue.queueId}`,
    type: input.queue.type,
    players: [...input.queue.players],
    active: true,
    recoveryReady: true,
    timeoutReady: true,
    createdAt: (input.now ?? new Date()).toISOString()
  };
}

export function closeGmarSession(
  session: GmarSession
): GmarSession {
  return {
    ...session,
    active: false
  };
}

export function assertGmarSession(
  session: GmarSession
): true {
  if (
    !session.sessionId ||
    session.players.length < 2 ||
    session.recoveryReady !== true ||
    session.timeoutReady !== true
  ) {
    throw new Error("Invalid GMAR session.");
  }

  return true;
}
