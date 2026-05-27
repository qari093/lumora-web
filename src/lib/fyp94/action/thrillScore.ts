export type Fyp94ThrillInput = {
  title: string;
  tags: string[];
  durationSeconds: number;
  sizeBytes?: number;
  width?: number;
  height?: number;
  brightnessSpike?: number;
  motionSpike?: number;
};

const HIGH_INTENSITY_KEYWORDS = [
  "stunt",
  "fail",
  "pov",
  "speed",
  "race",
  "jump",
  "parkour",
  "surf",
  "skate",
  "bike",
  "drift",
  "crash",
  "extreme",
  "adrenaline",
];

export function scoreFyp94Keywords(input: Pick<Fyp94ThrillInput, "title" | "tags">): number {
  const text = `${input.title} ${input.tags.join(" ")}`.toLowerCase();
  const hits = HIGH_INTENSITY_KEYWORDS.filter((keyword) => text.includes(keyword)).length;
  return Math.min(40, hits * 10);
}

export function scoreFyp94Duration(seconds: number): number {
  if (!Number.isFinite(seconds)) return 0;
  if (seconds >= 7 && seconds <= 20) return 25;
  if (seconds <= 30) return 18;
  if (seconds <= 45) return 10;
  return 0;
}

export function scoreFyp94MotionProxy(input: Pick<Fyp94ThrillInput, "sizeBytes" | "durationSeconds">): number {
  if (!input.sizeBytes || input.durationSeconds <= 0) return 0;
  const bytesPerSecond = input.sizeBytes / input.durationSeconds;
  if (bytesPerSecond > 450_000) return 20;
  if (bytesPerSecond > 250_000) return 12;
  if (bytesPerSecond > 125_000) return 6;
  return 0;
}

export function scoreFyp94PeakMoment(input: Pick<Fyp94ThrillInput, "brightnessSpike" | "motionSpike">): number {
  const brightness = Math.max(0, Math.min(1, input.brightnessSpike ?? 0));
  const motion = Math.max(0, Math.min(1, input.motionSpike ?? 0));
  return Math.round((brightness * 0.4 + motion * 0.6) * 15);
}

export function calculateFyp94ThrillScore(input: Fyp94ThrillInput): number {
  return Math.min(
    100,
    scoreFyp94Keywords(input) +
      scoreFyp94Duration(input.durationSeconds) +
      scoreFyp94MotionProxy(input) +
      scoreFyp94PeakMoment(input),
  );
}
