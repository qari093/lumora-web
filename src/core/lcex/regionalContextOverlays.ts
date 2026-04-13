export type RegionalContextOverlay = {
  region: string;
  label: string;
  sensitivityBoost: number;
  cultureNote: string;
  spreadControl: "none" | "soft" | "strict";
};

export const REGIONAL_CONTEXT_OVERLAYS: RegionalContextOverlay[] = [
  {
    region: "global",
    label: "Global Default",
    sensitivityBoost: 0,
    cultureNote: "Default global handling.",
    spreadControl: "none",
  },
  {
    region: "eu",
    label: "Europe",
    sensitivityBoost: 8,
    cultureNote: "Account for multilingual and national-context variance.",
    spreadControl: "soft",
  },
  {
    region: "mena",
    label: "MENA",
    sensitivityBoost: 18,
    cultureNote: "Higher care for religious and symbolism-sensitive framing.",
    spreadControl: "strict",
  },
  {
    region: "south-asia",
    label: "South Asia",
    sensitivityBoost: 16,
    cultureNote: "Higher care for language nuance, national identity, and fandom intensity.",
    spreadControl: "soft",
  },
];

export function getRegionalContextOverlay(
  region: string
): RegionalContextOverlay {
  return (
    REGIONAL_CONTEXT_OVERLAYS.find(
      (entry) => entry.region === region.trim().toLowerCase()
    ) ?? REGIONAL_CONTEXT_OVERLAYS[0]
  );
}

export function applyRegionalContextOverlay(
  baseSensitivity: number,
  region: string
): number {
  const overlay = getRegionalContextOverlay(region);
  return Math.max(0, Math.min(100, Math.round(baseSensitivity + overlay.sensitivityBoost)));
}
