export type PresetName = "spectacle" | "asmr" | "transform" | "neutral";

export type PresetTuning = {
  clipSpeed?: number;             // default 1.0
  saturation?: number;            // ~1.0
  crossfadeMs?: number | null;    // null = hard cuts
  voiceGainDb?: number;           // +dB
  musicGainDb?: number;           // -dB
  duckAmountDb?: number;          // negative to duck when voice present
};

export function pickPreset(name: PresetName): PresetTuning {
  switch (name) {
    case "spectacle":
      return { clipSpeed: 1.15, saturation: 1.10, crossfadeMs: 120,
               voiceGainDb: +2, musicGainDb: -6, duckAmountDb: -6 };
    case "asmr":
      return { clipSpeed: 0.95, saturation: 0.98, crossfadeMs: 320,
               voiceGainDb: +0, musicGainDb: -12, duckAmountDb: -3 };
    case "transform":
      return { clipSpeed: 1.00, saturation: 1.04, crossfadeMs: 160,
               voiceGainDb: +3, musicGainDb: -8, duckAmountDb: -9 };
    default:
      return { clipSpeed: 1.00, saturation: 1.00, crossfadeMs: null,
               voiceGainDb: +0, musicGainDb: -8, duckAmountDb: -6 };
  }
}
