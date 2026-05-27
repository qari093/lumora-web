import { describe, expect, it } from "vitest";
import { mapPlayerEventToSignal } from "@/src/lib/integration/video-player-sync/playerEventSignals";
import { triggerHold, triggerPresent, triggerRewatch } from "@/src/lib/integration/video-player-sync/signalTriggers";
import { createPlaybackTimestampTrace } from "@/src/lib/integration/video-player-sync/timestampTracking";
import { syncPlaybackToSignalEngine } from "@/src/lib/integration/video-player-sync/playbackSignalSync";
import { validateSignalAccuracy } from "@/src/lib/integration/video-player-sync/validateSignalAccuracy";

const base = {
  videoId: "v1",
  creatorId: "c1",
  witnessId: "w1",
};

describe("Integration Pack03 — Video Player Sync", () => {
  it("connects player events to signals", () => {
    const signal = mapPlayerEventToSignal({
      ...base,
      eventType: "play",
      currentTimeMs: 1000,
    });

    expect(signal?.type).toBe("present");
    expect(signal?.humanOnly).toBe(true);
  });

  it("triggers present, hold, and rewatch", () => {
    expect(triggerPresent({ ...base, timestampMs: 1 }).type).toBe("present");
    expect(triggerHold({ ...base, timestampMs: 2, holdDurationMs: 1200 }).type).toBe("hold");
    expect(triggerRewatch({ ...base, timestampMs: 3, rewatchCount: 1 }).type).toBe("rewatch");
  });

  it("attaches timestamp tracking", () => {
    const trace = createPlaybackTimestampTrace({
      videoId: "v1",
      currentTimeMs: 5000,
      durationMs: 10000,
      recordedAt: "2026-05-02T00:00:00.000Z",
    });

    expect(trace.progress).toBe(0.5);
    expect(trace.recordedAt).toBe("2026-05-02T00:00:00.000Z");
  });

  it("syncs playback to signal engine", () => {
    const out = syncPlaybackToSignalEngine({
      ...base,
      currentTimeMs: 5000,
      durationMs: 10000,
      holdDurationMs: 1500,
      rewatchCount: 1,
    });

    expect(out.trace.videoId).toBe("v1");
    expect(out.signals.map((signal) => signal.type)).toContain("present");
    expect(out.signals.map((signal) => signal.type)).toContain("hold");
    expect(out.signals.map((signal) => signal.type)).toContain("rewatch");
  });

  it("validates signal accuracy", () => {
    const signal = triggerPresent({ ...base, timestampMs: 1000 });

    expect(validateSignalAccuracy({ signal, ...base }).ok).toBe(true);
    expect(validateSignalAccuracy({ signal, videoId: "wrong", creatorId: "c1", witnessId: "w1" }).ok).toBe(false);
  });
});
