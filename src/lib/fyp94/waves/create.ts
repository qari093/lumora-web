import type { Fyp94MomentWave, Fyp94WaveClip } from "./types";

export function createFyp94MomentWave(input: {
  category: string;
  clips: Fyp94WaveClip[];
  now?: Date;
  durationMinutes?: number;
}): Fyp94MomentWave {
  const now = input.now ?? new Date();
  const duration = input.durationMinutes ?? 45;

  return {
    waveId: `wave_${input.category}_${now.getTime()}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
    category: input.category,
    clipIds: input.clips.map((clip) => clip.id),
    startsAt: now.toISOString(),
    endsAt: new Date(now.getTime() + duration * 60_000).toISOString(),
    label: `🔥 ${input.category} happening now`,
    state: "active",
  };
}

export function endFyp94MomentWave(wave: Fyp94MomentWave): Fyp94MomentWave {
  return { ...wave, state: "ended" };
}
