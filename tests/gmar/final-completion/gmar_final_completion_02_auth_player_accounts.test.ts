import {
  createGmarAuthSession,
  assertGmarAuthSession,
  assertGmarPlayerPermission
} from "@/src/core/gmar/final-completion/auth/playerAuth";

describe("GMAR Final Completion Phase 02 — Authentication + Player Accounts", () => {
  it("creates authenticated player session", () => {
    const { session, player } = createGmarAuthSession({
      userId: "user_001",
      displayName: "Waqar",
      sessionId: "session_001",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(session.sessionId).toBe("session_001");
    expect(session.userId).toBe("user_001");
    expect(session.playerId).toBe("gmar_user_001");
    expect(session.authenticated).toBe(true);
    expect(player.playerId).toBe("gmar_user_001");
    expect(assertGmarAuthSession(session)).toBe(true);
    expect(assertGmarPlayerPermission({
      session,
      playerId: player.playerId
    })).toBe(true);
  });

  it("rejects missing userId", () => {
    expect(() =>
      createGmarAuthSession({
        userId: " "
      })
    ).toThrow("GMAR auth requires userId.");
  });

  it("rejects wrong player permission", () => {
    const { session } = createGmarAuthSession({
      userId: "user_001"
    });

    expect(() =>
      assertGmarPlayerPermission({
        session,
        playerId: "gmar_other_user"
      })
    ).toThrow("GMAR player permission denied.");
  });
});
