export type Fyp94WaveClip = {
  id: string;
  category: string;
  thrillScore: number;
};

export type Fyp94MomentWave = {
  waveId: string;
  category: string;
  clipIds: string[];
  startsAt: string;
  endsAt: string;
  label: string;
  state: "active" | "ended";
};
