import { describe, expect, it } from "vitest";
import {
  createContentEngineSignal,
  mapBehaviorToEmotionalLayer,
  translateMetricLanguage,
  validateContentEngineSignal,
} from "@/src/content-engine/signal";

describe("Content Engine Pack01 — Signal Contract + Emotional Layer", () => {
  it("creates valid Lumora-aligned content engine signal", () => {
    const signal = createContentEngineSignal({
      eventType: "content.feed.signal",
      source: "engine",
      payload: { contentId: "c1", signalType: "hold" },
      emotional: { presenceDepth: 0.7, emotionalMomentum: 0.7 },
      nowIso: "2026-05-04T00:00:00.000Z",
      eventId: "evt1",
    });

    expect(signal.eventId).toBe("evt1");
    expect(signal.emotional.presenceDepth).toBe(0.7);
    expect(validateContentEngineSignal(signal).ok).toBe(true);
  });

  it("maps user behavior into Lumora emotional language", () => {
    expect(mapBehaviorToEmotionalLayer({
      signalType: "hold",
      watchDurationMs: 7000,
      videoDurationMs: 10000,
    }).presenceDepth).toBe(0.7);

    expect(mapBehaviorToEmotionalLayer({ signalType: "rewatch" }).resonance).toBe(1);
    expect(mapBehaviorToEmotionalLayer({ signalType: "skip" }).drift).toBe(1);
  });

  it("translates technical metrics into Lumora language", () => {
    expect(translateMetricLanguage("heat_score")).toBe("resonance_index");
    expect(translateMetricLanguage("hold_rate")).toBe("presence_depth");
    expect(translateMetricLanguage("skip_rate")).toBe("drift");
    expect(translateMetricLanguage("engagement_velocity")).toBe("emotional_momentum");
  });
});
