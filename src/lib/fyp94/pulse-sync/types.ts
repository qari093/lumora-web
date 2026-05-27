export type Fyp94PulseSyncTrigger = {
  clipId: string;
  waveId?: string;
  thrillScore: number;
  viewerCount: number;
  peakMs: number;
  userEnabled: boolean;
};

export type Fyp94PulseSyncEffect = {
  clipId: string;
  visualPulse: boolean;
  haptic: boolean;
  peakMs: number;
  intensity: "none" | "subtle" | "strong";
};
