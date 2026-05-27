import {
  createGmarMatchmakingQueue,
  enqueueGmarPlayer,
  createGmarSession,
  closeGmarSession,
  assertGmarSession
} from "@/src/core/gmar/final-completion/matchmaking/matchmakingSessions";

describe("GMAR Final Completion Phase 06 — Matchmaking + Sessions", () => {
  it("creates matchmaking queue", () => {
    const queue = createGmarMatchmakingQueue({
      queueId: "origin_match",
      type: "pve"
    });

    expect(queue.queueId).toBe("origin_match");
    expect(queue.players).toHaveLength(0);
    expect(queue.maxPlayers).toBe(4);
    expect(queue.fairnessRulesReady).toBe(true);
    expect(queue.telemetryReady).toBe(true);
  });

  it("creates active GMAR session", () => {
    const queue = createGmarMatchmakingQueue({
      queueId: "origin_match",
      type: "pvp"
    });

    const withOne = enqueueGmarPlayer({
      queue,
      playerId: "gmar_user_001"
    });

    const withTwo = enqueueGmarPlayer({
      queue: withOne,
      playerId: "gmar_user_002"
    });

    const session = createGmarSession({
      queue: withTwo,
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(session.sessionId).toBe("gmar_session_origin_match");
    expect(session.players).toHaveLength(2);
    expect(session.active).toBe(true);
    expect(session.recoveryReady).toBe(true);
    expect(session.timeoutReady).toBe(true);

    expect(assertGmarSession(session)).toBe(true);

    const closed = closeGmarSession(session);

    expect(closed.active).toBe(false);
  });

  it("rejects duplicate queue player", () => {
    const queue = createGmarMatchmakingQueue({
      queueId: "origin_match",
      type: "pve"
    });

    const withOne = enqueueGmarPlayer({
      queue,
      playerId: "gmar_user_001"
    });

    expect(() =>
      enqueueGmarPlayer({
        queue: withOne,
        playerId: "gmar_user_001"
      })
    ).toThrow("GMAR player already queued.");
  });

  it("rejects session creation with insufficient players", () => {
    const queue = createGmarMatchmakingQueue({
      queueId: "origin_match",
      type: "pve"
    });

    const withOne = enqueueGmarPlayer({
      queue,
      playerId: "gmar_user_001"
    });

    expect(() =>
      createGmarSession({
        queue: withOne
      })
    ).toThrow("GMAR matchmaking requires at least 2 players.");
  });
});
