import { describe, expect, it } from "vitest";
import { createHeartfire } from "../../src/live/heartfires/heartfireCore";
import { progressQuest } from "../../src/live/heartfires/pulseQuestCore";
import { isAllianceActive } from "../../src/live/alliances/allianceCore";

describe("Lumora Live Pack 6 — Constellations", () => {
  it("creates Heartfire from Constellation sync score", () => {
    const heartfire = createHeartfire({
      id: "c1",
      name: "Quiet Stars",
      symbol: "✦",
      state: "active",
      memberCount: 8,
      syncScore: 72,
      createdAt: new Date().toISOString(),
    });

    expect(heartfire.constellationId).toBe("c1");
    expect(heartfire.warmth).toBe(72);
  });

  it("completes Heartfire Pulse Quest safely", () => {
    const quest = progressQuest({
      id: "q1",
      constellationId: "c1",
      title: "Ignite the Lunar Flame",
      targetMinutes: 100,
      currentMinutes: 80,
      completed: false,
    }, 25);

    expect(quest.completed).toBe(true);
    expect(quest.currentMinutes).toBe(105);
  });

  it("detects active Alliance Beacon", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    expect(isAllianceActive({
      id: "a1",
      constellationIds: ["c1", "c2"],
      startsAt: "2026-01-01T00:00:00Z",
      endsAt: "2026-01-03T00:00:00Z",
      active: true,
    }, now)).toBe(true);
  });
});
