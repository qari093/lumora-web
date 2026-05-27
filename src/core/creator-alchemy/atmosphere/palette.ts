import type { AtmosphereMood, AtmospherePalette } from "./types";

const PALETTES: Record<AtmosphereMood, AtmospherePalette> = {
  quiet: {
    mood: "quiet",
    gradient: "linear-gradient(135deg, rgba(20,24,38,0.92), rgba(40,46,70,0.82))",
    glow: "rgba(120,140,255,0.16)",
    contrastSafe: true
  },
  reflective: {
    mood: "reflective",
    gradient: "linear-gradient(135deg, rgba(52,42,92,0.82), rgba(16,42,70,0.76))",
    glow: "rgba(122,92,255,0.18)",
    contrastSafe: true
  },
  blooming: {
    mood: "blooming",
    gradient: "linear-gradient(135deg, rgba(38,66,52,0.82), rgba(58,92,74,0.72))",
    glow: "rgba(110,255,190,0.14)",
    contrastSafe: true
  },
  returning: {
    mood: "returning",
    gradient: "linear-gradient(135deg, rgba(48,42,36,0.86), rgba(94,72,50,0.72))",
    glow: "rgba(255,190,120,0.13)",
    contrastSafe: true
  },
  soft: {
    mood: "soft",
    gradient: "linear-gradient(135deg, rgba(52,40,58,0.82), rgba(70,54,84,0.70))",
    glow: "rgba(255,160,230,0.12)",
    contrastSafe: true
  },
  open: {
    mood: "open",
    gradient: "linear-gradient(135deg, rgba(30,52,76,0.80), rgba(32,78,92,0.70))",
    glow: "rgba(80,220,255,0.13)",
    contrastSafe: true
  }
};

export function getAtmospherePalette(mood: AtmosphereMood): AtmospherePalette {
  return PALETTES[mood] ?? PALETTES.open;
}

export function validatePaletteAccessibility(palette: AtmospherePalette): boolean {
  return palette.contrastSafe && palette.gradient.length > 0 && palette.glow.length > 0;
}
