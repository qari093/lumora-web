import { describe, expect, it } from "vitest";
import { detectRuntimeStrongestMoment, scoreRuntimeMoment } from "@/src/lib/integration/your-moment-injection/runtimeStrongestMoment";
import { injectMomentCardIntoDashboard } from "@/src/lib/integration/your-moment-injection/injectMomentCard";
import { buildRuntimeReplayWindow } from "@/src/lib/integration/your-moment-injection/replayWindow";
import { buildRuntimeMomentSilhouettes } from "@/src/lib/integration/your-moment-injection/momentSilhouettes";
import { validateMomentCardRendering } from "@/src/lib/integration/your-moment-injection/validateMomentCard";

describe("Integration Pack10 — Your Moment Card Injection", () => {
  it("detects strongest moment in runtime", () => {
    const moments = [
      { videoId: "v1", timestampMs: 1000, present: 1, stillness: 0, hold: 0, rewatch: 0, silentOvation: 0 },
      { videoId: "v2", timestampMs: 5000, present: 1, stillness: 1, hold: 1, rewatch: 1, silentOvation: 1 },
    ];

    expect(scoreRuntimeMoment(moments[1])).toBeGreaterThan(scoreRuntimeMoment(moments[0]));
    expect(detectRuntimeStrongestMoment(moments)?.videoId).toBe("v2");
  });

  it("injects moment card into dashboard", () => {
    const dashboard = injectMomentCardIntoDashboard({}, {
      videoId: "v1",
      timestampMs: 4000,
      behaviorText: "2 present, 1 held",
    });

    expect(dashboard.yourMomentCard.visible).toBe(true);
    expect(dashboard.yourMomentCard.interpretationText).toBe(false);
  });

  it("attaches replay window", () => {
    const replay = buildRuntimeReplayWindow({
      videoId: "v1",
      timestampMs: 5000,
      durationMs: 20000,
    });

    expect(replay.startMs).toBe(2000);
    expect(replay.durationMs).toBe(6000);
  });

  it("adds silhouettes", () => {
    const silhouettes = buildRuntimeMomentSilhouettes(["w1", "w1", "w2"]);

    expect(silhouettes).toHaveLength(2);
    expect(silhouettes[0].anonymous).toBe(true);
    expect(silhouettes[0].profileHidden).toBe(true);
  });

  it("validates card rendering", () => {
    const moment = detectRuntimeStrongestMoment([
      { videoId: "v1", timestampMs: 4000, present: 1, stillness: 1, hold: 1, rewatch: 0, silentOvation: 1 },
    ]);

    const replay = buildRuntimeReplayWindow({
      videoId: moment!.videoId,
      timestampMs: moment!.timestampMs,
      durationMs: 20000,
    });

    const silhouettes = buildRuntimeMomentSilhouettes(["w1", "w2"]);

    const dashboard = injectMomentCardIntoDashboard({}, {
      videoId: moment!.videoId,
      timestampMs: moment!.timestampMs,
      replay,
      silhouettes,
    });

    expect(validateMomentCardRendering(dashboard.yourMomentCard).ok).toBe(true);
    expect(validateMomentCardRendering({}).ok).toBe(false);
  });
});
