import { describe, expect, it } from "vitest";
import { createFyp94PulseScoreState, updateFyp94DailyStreak } from "../../src/lib/fyp94/pulse-score/streak";
import { applyFyp94PulseScoreEvent } from "../../src/lib/fyp94/pulse-score/scoring";
import { applyFyp94SoftDecay } from "../../src/lib/fyp94/pulse-score/decay";
import { buildFyp94PrivatePulseDisplay } from "../../src/lib/fyp94/pulse-score/display";

describe("FYP 9.4 Pack 013 — Pulse Score", () => {
  it("creates private streak model", () => {
    const state = createFyp94PulseScoreState({
      anonymousUserId: "anon_1",
      now: new Date("2026-01-01T10:00:00.000Z"),
    });

    expect(state.anonymousUserId).toBe("anon_1");
    expect(state.streakDays).toBe(0);
  });

  it("updates daily streak", () => {
    const state = createFyp94PulseScoreState({
      anonymousUserId: "anon_1",
      now: new Date("2026-01-01T10:00:00.000Z"),
    });

    const updated = updateFyp94DailyStreak(state, "2026-01-02", new Date("2026-01-02T10:00:00.000Z"));

    expect(updated.streakDays).toBe(1);
    expect(updated.lastActiveDate).toBe("2026-01-02");
  });

  it("adds full-watch and completion scoring", () => {
    const state = createFyp94PulseScoreState({ anonymousUserId: "anon_1" });
    const watched = applyFyp94PulseScoreEvent(state, { type: "full_watch" });
    const completed = applyFyp94PulseScoreEvent(watched, { type: "sequence_completed" });

    expect(watched.score).toBe(3);
    expect(completed.score).toBe(13);
  });

  it("applies soft decay", () => {
    const state = {
      ...createFyp94PulseScoreState({ anonymousUserId: "anon_1" }),
      score: 30,
      streakDays: 5,
    };

    const decayed = applyFyp94SoftDecay({ state, inactiveDays: 2 });

    expect(decayed.score).toBe(20);
    expect(decayed.streakDays).toBe(0);
  });

  it("builds private display", () => {
    const state = {
      ...createFyp94PulseScoreState({ anonymousUserId: "anon_1" }),
      score: 12,
      streakDays: 3,
    };

    const display = buildFyp94PrivatePulseDisplay(state);

    expect(display.label).toBe("Your Pulse");
    expect(display.streakLabel).toContain("3 day");
    expect(display.scoreLabel).toContain("12");
  });
});
