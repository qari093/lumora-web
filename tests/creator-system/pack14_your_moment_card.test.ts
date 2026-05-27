import { describe, expect, it } from "vitest";
import { detectStrongestTraceMoment, scoreTraceMoment } from "@/src/lib/creator-system/your-moment-card/strongestTrace";
import { buildTimestampedHumanBehavior } from "@/src/lib/creator-system/your-moment-card/timestampedBehavior";
import { buildSixSecondReplayWindow } from "@/src/lib/creator-system/your-moment-card/replayWindow";
import { buildPresenceSilhouettes } from "@/src/lib/creator-system/your-moment-card/presenceSilhouettes";
import { buildYourMomentCard } from "@/src/lib/creator-system/your-moment-card/yourMomentCard";

describe("Pack14 Your Moment Card", () => {
  it("detects strongest trace moment", () => {
    const moments = [
      { videoId: "v1", timestampMs: 1000, present: 1, stillness: 0, hold: 0, rewatch: 0, silentOvation: 0 },
      { videoId: "v2", timestampMs: 5000, present: 1, stillness: 1, hold: 1, rewatch: 1, silentOvation: 1 },
    ];

    expect(scoreTraceMoment(moments[1])).toBeGreaterThan(scoreTraceMoment(moments[0]));
    expect(detectStrongestTraceMoment(moments)?.videoId).toBe("v2");
  });

  it("shows exact timestamped human behavior", () => {
    const behavior = buildTimestampedHumanBehavior({
      videoId: "v1",
      timestampMs: 4000,
      present: 2,
      stillness: 1,
      hold: 1,
      rewatch: 0,
      silentOvation: 1,
    });

    expect(behavior.timestampMs).toBe(4000);
    expect(behavior.behaviorText).toContain("2 present");
    expect(behavior.interpretationText).toBe(false);
  });

  it("builds optional 6-second replay", () => {
    const replay = buildSixSecondReplayWindow({
      videoId: "v1",
      timestampMs: 5000,
      videoDurationMs: 20000,
    });

    expect(replay.startMs).toBe(2000);
    expect(replay.durationMs).toBe(6000);
  });

  it("adds anonymous presence silhouettes", () => {
    const silhouettes = buildPresenceSilhouettes(["w1", "w1", "w2"]);
    expect(silhouettes).toHaveLength(2);
    expect(silhouettes[0].anonymous).toBe(true);
    expect(silhouettes[0].profileHidden).toBe(true);
  });

  it("builds card without interpretation text", () => {
    const card = buildYourMomentCard({
      moments: [
        { videoId: "v1", timestampMs: 4000, present: 1, stillness: 1, hold: 1, rewatch: 0, silentOvation: 1 },
      ],
      witnessIds: ["w1", "w2"],
      videoDurationMs: 20000,
    });

    expect(card.available).toBe(true);
    expect(card.interpretationText).toBe(false);
    expect(card.silhouettes).toHaveLength(2);
  });
});
