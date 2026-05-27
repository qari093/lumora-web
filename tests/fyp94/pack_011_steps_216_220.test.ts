import { describe, expect, it } from "vitest";
import { isFyp94PulseSyncEligible } from "../../src/lib/fyp94/pulse-sync/triggers";
import { buildFyp94PulseSyncEffect } from "../../src/lib/fyp94/pulse-sync/effects";
import { limitFyp94PulseSyncFrequency } from "../../src/lib/fyp94/pulse-sync/limits";
import {
  FYP94_DEFAULT_PULSE_SYNC_PREFERENCE,
  applyFyp94PulseSyncPreference,
} from "../../src/lib/fyp94/pulse-sync/preferences";

describe("FYP 9.4 Pack 011 — Pulse Sync", () => {
  it("defines high-impact sync triggers", () => {
    expect(
      isFyp94PulseSyncEligible({
        clipId: "clip_1",
        thrillScore: 90,
        viewerCount: 600,
        peakMs: 1200,
        userEnabled: true,
      }),
    ).toBe(true);

    expect(
      isFyp94PulseSyncEligible({
        clipId: "clip_1",
        thrillScore: 40,
        viewerCount: 600,
        peakMs: 1200,
        userEnabled: true,
      }),
    ).toBe(false);
  });

  it("builds visual pulse and optional haptic effect", () => {
    const effect = buildFyp94PulseSyncEffect({
      clipId: "clip_1",
      waveId: "wave_1",
      thrillScore: 90,
      viewerCount: 100,
      peakMs: 900,
      userEnabled: true,
    });

    expect(effect.visualPulse).toBe(true);
    expect(effect.haptic).toBe(true);
    expect(effect.intensity).toBe("subtle");
  });

  it("limits pulse frequency", () => {
    const effects = Array.from({ length: 4 }).map((_, index) =>
      buildFyp94PulseSyncEffect({
        clipId: `clip_${index}`,
        waveId: "wave_1",
        thrillScore: 90,
        viewerCount: 1000,
        peakMs: 900,
        userEnabled: true,
      }),
    );

    const limited = limitFyp94PulseSyncFrequency({ effects, maxPerBatch: 2 });

    expect(limited.filter((effect) => effect.visualPulse)).toHaveLength(2);
  });

  it("applies user control preference", () => {
    expect(FYP94_DEFAULT_PULSE_SYNC_PREFERENCE.enabled).toBe(true);
    expect(FYP94_DEFAULT_PULSE_SYNC_PREFERENCE.hapticsEnabled).toBe(false);

    const applied = applyFyp94PulseSyncPreference(
      { visualPulse: true, haptic: true },
      FYP94_DEFAULT_PULSE_SYNC_PREFERENCE,
    );

    expect(applied.visualPulse).toBe(true);
    expect(applied.haptic).toBe(false);
  });
});
