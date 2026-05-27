import { describe, expect, it } from "vitest";
import { createFyp94AttributionLink } from "../../src/lib/fyp94/attribution/link";
import { buildFyp94AttributionMessage, removeFyp94AttributionPrecision } from "../../src/lib/fyp94/attribution/message";
import { shouldDisplayFyp94Attribution } from "../../src/lib/fyp94/attribution/rateLimit";

describe("FYP 9.4 Pack 016 — Echo Attribution", () => {
  it("links signals to waves", () => {
    const link = createFyp94AttributionLink({
      anonymousUserId: "anon_1",
      category: "surf",
      waveId: "wave_1",
      signalWeight: 5,
      now: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(link.category).toBe("surf");
    expect(link.waveId).toBe("wave_1");
    expect(link.contributionLevel).toBe("medium");
  });

  it("builds attribution message", () => {
    const link = createFyp94AttributionLink({
      anonymousUserId: "anon_1",
      category: "surf",
      waveId: "wave_1",
      signalWeight: 12,
    });

    const message = buildFyp94AttributionMessage(link);

    expect(message.display).toBe(true);
    expect(message.message).toContain("signals like yours");
  });

  it("removes fake precision", () => {
    expect(removeFyp94AttributionPrecision("12% of this wave came from you")).not.toContain("12");
  });

  it("rate-limits attribution display", () => {
    expect(shouldDisplayFyp94Attribution({})).toBe(true);

    expect(
      shouldDisplayFyp94Attribution({
        lastDisplayedAt: "2026-01-01T00:00:00.000Z",
        now: new Date("2026-01-01T04:00:00.000Z"),
        minHours: 12,
      }),
    ).toBe(false);

    expect(
      shouldDisplayFyp94Attribution({
        lastDisplayedAt: "2026-01-01T00:00:00.000Z",
        now: new Date("2026-01-01T13:00:00.000Z"),
        minHours: 12,
      }),
    ).toBe(true);
  });
});
