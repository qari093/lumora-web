import {
  createGmarCreatorProfile,
  enableGmarCreatorMonetization,
  publishGmarCreatorEvent,
  assertGmarCreatorProfile
} from "@/src/core/gmar/creator-active/creatorEcosystem";

describe("GMAR Activation Phase 12 — Creator Ecosystem", () => {
  it("creates creator profile", () => {
    const profile = createGmarCreatorProfile({
      playerId: "gmar_user_001",
      displayName: "Waqar",
      factionName: "Origin Makers",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(profile.creatorId).toBe("creator_gmar_user_001");
    expect(profile.factionName).toBe("Origin Makers");
    expect(profile.moderationStatus).toBe("clean");
    expect(assertGmarCreatorProfile(profile)).toBe(true);
  });

  it("enables monetization for clean creator", () => {
    const profile = createGmarCreatorProfile({
      playerId: "gmar_user_001",
      displayName: "Waqar"
    });

    const updated = enableGmarCreatorMonetization(profile);

    expect(updated.monetizationEnabled).toBe(true);
    expect(assertGmarCreatorProfile(updated)).toBe(true);
  });

  it("publishes creator event", () => {
    const profile = createGmarCreatorProfile({
      playerId: "gmar_user_001",
      displayName: "Waqar"
    });

    const updated = publishGmarCreatorEvent(profile);

    expect(updated.publishedEvents).toBe(1);
    expect(assertGmarCreatorProfile(updated)).toBe(true);
  });

  it("rejects empty profile identity", () => {
    expect(() =>
      createGmarCreatorProfile({
        playerId: " ",
        displayName: " "
      })
    ).toThrow("GMAR creator profile requires playerId and displayName.");
  });
});
