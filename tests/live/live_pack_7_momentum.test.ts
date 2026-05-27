import { describe, expect, it } from "vitest";
import { clampIntensity, isPulseEventLive } from "../../src/live/events/pulseEventCore";
import { createDropOfSilence } from "../../src/live/momentum/dropOfSilenceCore";
import { createChaosDrop } from "../../src/live/momentum/chaosDropCore";

describe("Lumora Live Pack 7 — Momentum", () => {
  it("detects live pulse event windows", () => {
    expect(isPulseEventLive({
      id: "e1",
      kind: "flash_arena",
      roomId: "r1",
      startsAt: "2026-01-01T10:00:00Z",
      endsAt: "2026-01-01T10:15:00Z",
      intensity: 80,
    }, new Date("2026-01-01T10:05:00Z"))).toBe(true);
  });

  it("clamps event intensity", () => {
    expect(clampIntensity(140)).toBe(100);
    expect(clampIntensity(-5)).toBe(0);
  });

  it("creates signature Drop of Silence", () => {
    expect(createDropOfSilence("winner_reveal").durationMs).toBe(5000);
  });

  it("creates unsearchable Chaos Drop", () => {
    expect(createChaosDrop("c1", "Describe your day using animal sounds").searchable).toBe(false);
  });
});
