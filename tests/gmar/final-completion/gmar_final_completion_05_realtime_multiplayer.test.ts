import {
  createGmarRealtimeRoom,
  joinGmarRealtimeRoom,
  heartbeatGmarRealtimeClient,
  assertGmarRealtimeRoom
} from "@/src/core/gmar/final-completion/realtime/realtimeMultiplayer";

describe("GMAR Final Completion Phase 05 — Realtime Multiplayer", () => {
  it("creates realtime room", () => {
    const room = createGmarRealtimeRoom({
      roomId: "origin_presence",
      channel: "presence",
      ownerPlayerId: "gmar_user_001",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(room.roomId).toBe("origin_presence");
    expect(room.channel).toBe("presence");
    expect(room.members).toHaveLength(1);
    expect(room.maxMembers).toBe(8);
    expect(room.stateBroadcastReady).toBe(true);
    expect(room.conflictResolutionReady).toBe(true);
    expect(room.rateLimitReady).toBe(true);
    expect(assertGmarRealtimeRoom(room)).toBe(true);
  });

  it("joins realtime room and updates heartbeat", () => {
    const room = createGmarRealtimeRoom({
      roomId: "origin_presence",
      channel: "presence",
      ownerPlayerId: "gmar_user_001",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    const joined = joinGmarRealtimeRoom({
      room,
      playerId: "gmar_user_002",
      now: new Date("2026-05-09T00:01:00.000Z")
    });

    expect(joined.members).toHaveLength(2);

    const heartbeat = heartbeatGmarRealtimeClient({
      room: joined,
      playerId: "gmar_user_002",
      now: new Date("2026-05-09T00:02:00.000Z")
    });

    expect(
      heartbeat.members.find(member => member.playerId === "gmar_user_002")?.lastHeartbeatAt
    ).toBe("2026-05-09T00:02:00.000Z");

    expect(assertGmarRealtimeRoom(heartbeat)).toBe(true);
  });

  it("rejects duplicate join", () => {
    const room = createGmarRealtimeRoom({
      roomId: "origin_presence",
      channel: "presence",
      ownerPlayerId: "gmar_user_001"
    });

    expect(() =>
      joinGmarRealtimeRoom({
        room,
        playerId: "gmar_user_001"
      })
    ).toThrow("GMAR realtime player already joined.");
  });

  it("rejects heartbeat for missing player", () => {
    const room = createGmarRealtimeRoom({
      roomId: "origin_presence",
      channel: "presence",
      ownerPlayerId: "gmar_user_001"
    });

    expect(() =>
      heartbeatGmarRealtimeClient({
        room,
        playerId: "gmar_missing"
      })
    ).toThrow("GMAR realtime player not in room.");
  });
});
