import { describe, expect, it } from "vitest";
import { createFyp94SwerveSignal } from "../../src/lib/fyp94/signals/create";
import { aggregateFyp94SwerveSignals } from "../../src/lib/fyp94/signals/aggregate";
import { applyFyp94SignalWeightsToQueries } from "../../src/lib/fyp94/signals/ingestion";

describe("FYP 9.4 Pack 012 — Swerve Signals", () => {
  it("creates more-like-this, different, and switch-category signals", () => {
    const more = createFyp94SwerveSignal({
      type: "more_like_this",
      clipId: "clip_1",
      category: "surf",
      tags: ["wave", "wipeout"],
      anonymousSessionId: "anon_1",
      now: new Date("2026-01-01T00:00:00.000Z"),
    });

    const diff = createFyp94SwerveSignal({
      type: "different",
      clipId: "clip_2",
      category: "travel",
      anonymousSessionId: "anon_1",
    });

    const switchCategory = createFyp94SwerveSignal({
      type: "switch_category",
      clipId: "clip_3",
      category: "bike",
      anonymousSessionId: "anon_1",
    });

    expect(more.signalId).toContain("more_like_this");
    expect(diff.type).toBe("different");
    expect(switchCategory.type).toBe("switch_category");
  });

  it("aggregates global signal weights", () => {
    const signals = [
      createFyp94SwerveSignal({
        type: "more_like_this",
        clipId: "clip_1",
        category: "surf",
        tags: ["wave"],
        anonymousSessionId: "anon_1",
      }),
      createFyp94SwerveSignal({
        type: "more_like_this",
        clipId: "clip_2",
        category: "surf",
        tags: ["wave"],
        anonymousSessionId: "anon_2",
      }),
      createFyp94SwerveSignal({
        type: "different",
        clipId: "clip_3",
        category: "travel",
        tags: ["city"],
        anonymousSessionId: "anon_3",
      }),
    ];

    const weights = aggregateFyp94SwerveSignals(signals);

    expect(weights[0].category).toBe("surf");
    expect(weights[0].weight).toBe(2);
    expect(weights[0].tags.wave).toBe(2);
  });

  it("applies aggregate weights to next ingestion cycle", () => {
    const weights = aggregateFyp94SwerveSignals([
      createFyp94SwerveSignal({
        type: "more_like_this",
        clipId: "clip_1",
        category: "parkour",
        tags: ["jump", "pov"],
        anonymousSessionId: "anon_1",
      }),
    ]);

    const queries = applyFyp94SignalWeightsToQueries({
      baseQueries: ["speed", "stunt"],
      weights,
      maxQueries: 4,
    });

    expect(queries).toContain("parkour");
    expect(queries).toContain("jump");
    expect(queries).toContain("speed");
  });
});
