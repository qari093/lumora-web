export interface Storyframe {
  arc: string;
  fragment: string;
}

const FRAGMENTS = {
  quiet_day: [
    "Silence carried softly through your orbit."
  ],
  rising_wave: [
    "Momentum gathered beneath the calm surface."
  ],
  returning_spiral: [
    "Old emotions returned in gentler forms."
  ]
};

export function resolveStoryframe(
  energy: number
): Storyframe {
  const arc =
    energy < 0.3
      ? "quiet_day"
      : energy > 0.7
      ? "rising_wave"
      : "returning_spiral";

  return {
    arc,
    fragment: FRAGMENTS[arc][0]
  };
}
