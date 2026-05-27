export const supportedAccessibility = [
  "subtitles",
  "reduced-motion",
  "screen-reader",
  "high-contrast",
] as const;

export function buildCinemaPassport(region: string) {
  return {
    region,
    unlocked: true,
    stampCount: 1,
  };
}

export function supportsAccessibility(feature: string) {
  return supportedAccessibility.includes(feature as (typeof supportedAccessibility)[number]);
}

export function shouldUseLowBandwidthMode(input: {
  connectionMbps: number;
  saveData: boolean;
}) {
  return input.saveData || input.connectionMbps < 3;
}
