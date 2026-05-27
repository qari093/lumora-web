export type GmarRealtimeChannel =
  | "presence"
  | "squad"
  | "event"
  | "live_room";

export type GmarRealtimeClient = {
  playerId: string;
  connected: boolean;
  lastHeartbeatAt: string;
};

export type GmarRealtimeRoom = {
  roomId: string;
  channel: GmarRealtimeChannel;
  members: GmarRealtimeClient[];
  maxMembers: number;
  stateBroadcastReady: true;
  conflictResolutionReady: true;
  rateLimitReady: true;
};

export function createGmarRealtimeRoom(input: {
  roomId: string;
  channel: GmarRealtimeChannel;
  ownerPlayerId: string;
  now?: Date;
}): GmarRealtimeRoom {
  const roomId = input.roomId.trim();
  const ownerPlayerId = input.ownerPlayerId.trim();

  if (!roomId || !ownerPlayerId) {
    throw new Error("GMAR realtime room requires roomId and ownerPlayerId.");
  }

  return {
    roomId,
    channel: input.channel,
    members: [
      {
        playerId: ownerPlayerId,
        connected: true,
        lastHeartbeatAt: (input.now ?? new Date()).toISOString()
      }
    ],
    maxMembers: input.channel === "live_room" ? 50 : 8,
    stateBroadcastReady: true,
    conflictResolutionReady: true,
    rateLimitReady: true
  };
}

export function joinGmarRealtimeRoom(input: {
  room: GmarRealtimeRoom;
  playerId: string;
  now?: Date;
}): GmarRealtimeRoom {
  const playerId = input.playerId.trim();

  if (!playerId) {
    throw new Error("GMAR realtime join requires playerId.");
  }

  if (input.room.members.some(member => member.playerId === playerId)) {
    throw new Error("GMAR realtime player already joined.");
  }

  if (input.room.members.length >= input.room.maxMembers) {
    throw new Error("GMAR realtime room is full.");
  }

  return {
    ...input.room,
    members: [
      ...input.room.members,
      {
        playerId,
        connected: true,
        lastHeartbeatAt: (input.now ?? new Date()).toISOString()
      }
    ]
  };
}

export function heartbeatGmarRealtimeClient(input: {
  room: GmarRealtimeRoom;
  playerId: string;
  now?: Date;
}): GmarRealtimeRoom {
  const playerId = input.playerId.trim();

  if (!input.room.members.some(member => member.playerId === playerId)) {
    throw new Error("GMAR realtime player not in room.");
  }

  return {
    ...input.room,
    members: input.room.members.map(member =>
      member.playerId === playerId
        ? {
            ...member,
            connected: true,
            lastHeartbeatAt: (input.now ?? new Date()).toISOString()
          }
        : member
    )
  };
}

export function assertGmarRealtimeRoom(room: GmarRealtimeRoom): true {
  if (
    !room.roomId ||
    room.members.length < 1 ||
    room.members.length > room.maxMembers ||
    room.stateBroadcastReady !== true ||
    room.conflictResolutionReady !== true ||
    room.rateLimitReady !== true
  ) {
    throw new Error("Invalid GMAR realtime room.");
  }

  return true;
}
