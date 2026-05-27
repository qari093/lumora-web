export interface PulseSunState {
  mode: string;
  glow: number;
  whisper: string;
}

export function resolvePulseSun(mode: string): PulseSunState {
  return {
    mode,
    glow: mode === "calm" ? 0.7 : 0.45,
    whisper: resolveWhisper(0)
  };
}

export function resolveWhisper(index: number): string {
  const whispers = [
    "A quiet shape has formed.",
    "The atmosphere is listening softly.",
    "A gentle current is nearby."
  ];

  return whispers[Math.abs(index) % whispers.length];
}
