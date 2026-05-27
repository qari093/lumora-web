import { describe, expect, it } from "vitest";
import { detectFyp94HighScoreCluster } from "../../src/lib/fyp94/waves/detect";
import { createFyp94MomentWave, endFyp94MomentWave } from "../../src/lib/fyp94/waves/create";
import { addFyp94WaveWatchedClip, createFyp94WaveParticipation } from "../../src/lib/fyp94/waves/participation";
import { returnFyp94WaveClipsToPool } from "../../src/lib/fyp94/waves/pool";

const clips = [
  { id: "1", category: "surf", thrillScore: 90 },
  { id: "2", category: "surf", thrillScore: 85 },
  { id: "3", category: "surf", thrillScore: 80 },
  { id: "4", category: "bike", thrillScore: 95 },
];

describe("FYP 9.4 Pack 009 — Moment Waves", () => {
  it("detects high-score category clusters", () => {
    const cluster = detectFyp94HighScoreCluster({ clips, minScore: 75, minCount: 3 });
    expect(cluster.eligible).toBe(true);
    expect(cluster.category).toBe("surf");
    expect(cluster.clips).toHaveLength(3);
  });

  it("creates wave windows and metadata", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const wave = createFyp94MomentWave({ category: "surf", clips: clips.slice(0, 3), now, durationMinutes: 30 });

    expect(wave.state).toBe("active");
    expect(wave.label).toContain("happening now");
    expect(wave.clipIds).toHaveLength(3);
    expect(new Date(wave.endsAt).getTime() - new Date(wave.startsAt).getTime()).toBe(30 * 60_000);
  });

  it("tracks anonymous participation", () => {
    const participation = createFyp94WaveParticipation({
      waveId: "wave_1",
      anonymousUserId: "anon_1",
    });

    const updated = addFyp94WaveWatchedClip(participation, "clip_1");

    expect(updated.watchedClipIds).toContain("clip_1");
    expect(updated.anonymousUserId).toBe("anon_1");
  });

  it("returns wave clips to normal pool", () => {
    const wave = createFyp94MomentWave({
      category: "surf",
      clips: clips.slice(0, 3),
      now: new Date("2026-01-01T00:00:00.000Z"),
    });

    const returned = returnFyp94WaveClipsToPool({ wave: endFyp94MomentWave(wave), clips });

    expect(returned[0].thrillScore).toBe(85);
    expect(returned[3].thrillScore).toBe(95);
  });
});
