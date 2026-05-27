import {
  createGmarPlayerProfile,
  assertGmarPlayerProfile
} from "@/src/core/gmar/player/playerIdentity";

describe("GMAR Activation Phase 03 — Real Player Identity", () => {
  it("creates a valid GMAR player profile", () => {
    const profile = createGmarPlayerProfile({
      userId: "user_001",
      displayName: "Waqar",
      faction: "nexus",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(profile.userId).toBe("user_001");
    expect(profile.playerId).toBe("gmar_user_001");
    expect(profile.displayName).toBe("Waqar");
    expect(profile.faction).toBe("nexus");
    expect(profile.level).toBe(1);
    expect(profile.xp).toBe(0);
    expect(profile.avatarReady).toBe(true);
    expect(assertGmarPlayerProfile(profile)).toBe(true);
  });

  it("rejects missing userId", () => {
    expect(() => createGmarPlayerProfile({ userId: " " })).toThrow("GMAR player userId is required.");
  });
});
