import { describe, expect, it } from "vitest";

import {
  createRealtimeImpactSignal
} from "@/src/core/fyp/realtime-impact/signals";

import {
  addImpactSignal,
  createImpactWindow
} from "@/src/core/fyp/realtime-impact/impactWindow";

import {
  calculateRealtimeImpact
} from "@/src/core/fyp/realtime-impact/impactQuotient";

import {
  createReverberationGauge
} from "@/src/core/fyp/reverberation/gauge";

import {
  createImpactAlert
} from "@/src/core/fyp/reverberation/alerts";

describe("Lumora FYP Realtime Impact Engine", () => {
  it("creates realtime impact signal", () => {
    const signal = createRealtimeImpactSignal({
      contentId: "clip_1",
      creatorId: "creator_1",
      type: "echo",
      now: 100
    });

    expect(signal.weight).toBe(5);
    expect(signal.signalId).toContain("impact_clip_1_echo_100");
  });

  it("adds signals to impact window", () => {
    const window = createImpactWindow({
      contentId: "clip_1",
      creatorId: "creator_1"
    });

    const signal = createRealtimeImpactSignal({
      contentId: "clip_1",
      creatorId: "creator_1",
      type: "capsule_save",
      now: 100
    });

    const updated = addImpactSignal({
      window,
      signal
    });

    expect(updated.signals.length).toBe(1);
  });

  it("calculates realtime impact surge", () => {
    let window = createImpactWindow({
      contentId: "clip_1",
      creatorId: "creator_1"
    });

    for (let i = 0; i < 10; i++) {
      window = addImpactSignal({
        window,
        signal: createRealtimeImpactSignal({
          contentId: "clip_1",
          creatorId: "creator_1",
          type: "capsule_save",
          now: 100 + i
        })
      });
    }

    const report = calculateRealtimeImpact(window);

    expect(report.signalCount).toBe(10);
    expect(report.surge).toBe(true);
  });

  it("creates reverberation gauge", () => {
    const gauge = createReverberationGauge({
      contentId: "clip_1",
      creatorId: "creator_1",
      impactQuotient: 260,
      signalCount: 20,
      surge: true
    });

    expect(gauge.alertLevel).toBe("mythic");
    expect(gauge.waveformIntensity).toBe(100);
  });

  it("creates impact alert", () => {
    const alert = createImpactAlert({
      contentId: "clip_1",
      creatorId: "creator_1",
      waveformIntensity: 100,
      alertLevel: "surging"
    });

    expect(alert.urgent).toBe(true);
    expect(alert.message).toContain("surging");
  });
});
