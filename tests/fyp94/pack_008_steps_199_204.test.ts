import { describe, expect, it } from "vitest";
import { FYP94_FOMO_DISTRIBUTION, assignFyp94FomoType, wrapFyp94FomoItem } from "../../src/lib/fyp94/fomo/assign";
import { filterExpiredFyp94Fomo, isFyp94FomoExpired, preventFyp94FomoStacking } from "../../src/lib/fyp94/fomo/guard";

describe("FYP 9.4 Pack 008 — FOMO Engine", () => {
  it("locks FOMO distribution ratios", () => {
    expect(FYP94_FOMO_DISTRIBUTION.normal).toBe(0.7);
    expect(FYP94_FOMO_DISTRIBUTION.expiring_spotlight).toBe(0.15);
    expect(FYP94_FOMO_DISTRIBUTION.countdown_unlock).toBe(0.1);
    expect(FYP94_FOMO_DISTRIBUTION.sequence_chain).toBe(0.05);
  });

  it("assigns all FOMO card types", () => {
    expect(assignFyp94FomoType(0, 100)).toBe("sequence_chain");
    expect(assignFyp94FomoType(7, 100)).toBe("countdown_unlock");
    expect(assignFyp94FomoType(20, 100)).toBe("expiring_spotlight");
    expect(assignFyp94FomoType(50, 100)).toBe("normal");
  });

  it("creates expiring, countdown, and sequence metadata", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");

    const expiring = wrapFyp94FomoItem({ id: "1", item: {}, fomoType: "expiring_spotlight", now });
    const countdown = wrapFyp94FomoItem({ id: "2", item: {}, fomoType: "countdown_unlock", now });
    const sequence = wrapFyp94FomoItem({ id: "3", item: {}, fomoType: "sequence_chain", now });

    expect(expiring.expiresAt).toBeTruthy();
    expect(countdown.unlocksAt).toBeTruthy();
    expect(sequence.sequencePriority).toBe(1);
  });

  it("prevents stacked FOMO cards", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const items = [
      wrapFyp94FomoItem({ id: "1", item: {}, fomoType: "expiring_spotlight", now }),
      wrapFyp94FomoItem({ id: "2", item: {}, fomoType: "countdown_unlock", now }),
      wrapFyp94FomoItem({ id: "3", item: {}, fomoType: "sequence_chain", now }),
    ];

    const guarded = preventFyp94FomoStacking(items);

    expect(guarded[0].fomoType).not.toBe("normal");
    expect(guarded[1].fomoType).toBe("normal");
  });

  it("handles expiry", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const item = wrapFyp94FomoItem({
      id: "1",
      item: {},
      fomoType: "expiring_spotlight",
      now,
      ttlMinutes: 1,
    });

    const later = new Date("2026-01-01T00:02:00.000Z");

    expect(isFyp94FomoExpired(item, later)).toBe(true);
    expect(filterExpiredFyp94Fomo([item], later)).toHaveLength(0);
  });
});
