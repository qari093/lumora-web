import { describe, expect, it } from "vitest";
import {
  calculateFyp94ThrillScore,
  scoreFyp94Duration,
  scoreFyp94Keywords,
  scoreFyp94MotionProxy,
  scoreFyp94PeakMoment,
} from "../../src/lib/fyp94/action/thrillScore";
import {
  filterLowFyp94ThrillClips,
  promoteHighFyp94ThrillPool,
  scoreFyp94Clips,
} from "../../src/lib/fyp94/action/filter";
import { detectFyp94PeakMoment } from "../../src/lib/fyp94/action/peak";

describe("FYP 9.4 Pack 005 — Action Filter Engine", () => {
  it("scores keywords, duration, motion proxy, and peak moment", () => {
    expect(scoreFyp94Keywords({ title: "POV parkour stunt fail", tags: ["speed"] })).toBeGreaterThan(20);
    expect(scoreFyp94Duration(12)).toBe(25);
    expect(scoreFyp94MotionProxy({ sizeBytes: 10_000_000, durationSeconds: 20 })).toBeGreaterThan(0);
    expect(scoreFyp94PeakMoment({ brightnessSpike: 1, motionSpike: 1 })).toBe(15);
  });

  it("calculates full ThrillScore", () => {
    const score = calculateFyp94ThrillScore({
      title: "Extreme bike jump fail",
      tags: ["pov", "speed"],
      durationSeconds: 14,
      sizeBytes: 9_000_000,
      brightnessSpike: 0.7,
      motionSpike: 0.9,
    });

    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("detects peak moment from frame signals", () => {
    const peak = detectFyp94PeakMoment([
      { brightness: 0.1, motion: 0.1 },
      { brightness: 0.2, motion: 0.2 },
      { brightness: 0.9, motion: 0.95 },
    ]);

    expect(peak.index).toBe(2);
    expect(peak.motionSpike).toBeGreaterThan(0);
  });

  it("filters low-score clips", () => {
    const clips = [
      { title: "calm sunset", tags: ["nature"], durationSeconds: 40, sizeBytes: 1_000_000 },
      { title: "pov skate fail stunt", tags: ["speed"], durationSeconds: 12, sizeBytes: 8_000_000 },
    ];

    const kept = filterLowFyp94ThrillClips(clips, 45);
    expect(kept).toHaveLength(1);
    expect(kept[0].title).toContain("skate");
  });

  it("promotes high-score pool", () => {
    const clips = Array.from({ length: 10 }).map((_, index) => ({
      title: index < 3 ? `pov stunt fail ${index}` : `calm clip ${index}`,
      tags: index < 3 ? ["speed", "jump"] : ["nature"],
      durationSeconds: index < 3 ? 12 : 40,
      sizeBytes: index < 3 ? 8_000_000 : 1_000_000,
    }));

    const scored = scoreFyp94Clips(clips);
    const promoted = promoteHighFyp94ThrillPool(clips, 0.3);

    expect(scored).toHaveLength(10);
    expect(promoted).toHaveLength(3);
    expect(promoted[0].thrillScore).toBeGreaterThanOrEqual(promoted[2].thrillScore);
  });
});
