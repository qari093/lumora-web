export type LumoraDataMode = "seed" | "live" | "shadow";

export type DataModeInfo = Readonly<{
  mode: LumoraDataMode;
  seed: Readonly<{
    cineverse: boolean;
    echo: boolean;
    fyp: boolean;
    videos: boolean;
    gmar: boolean;
    nexa: boolean;
    live: boolean;
  }>;
  raw: Readonly<Record<string, string | undefined>>;
}>;

function envBool(v: string | undefined, defaultValue: boolean): boolean {
  if (v == null) return defaultValue;
  const s = String(v).trim().toLowerCase();
  if (s === "1" || s === "true" || s === "yes" || s === "on") return true;
  if (s === "0" || s === "false" || s === "no" || s === "off") return false;
  return defaultValue;
}

function normalizeMode(v: string | undefined): LumoraDataMode {
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "seed" || s === "live" || s === "shadow") return s;
  return "seed";
}

export function getDataModeInfo(): DataModeInfo {
  const raw = {
    LUMORA_DATA_MODE: process.env.LUMORA_DATA_MODE,
    LUMORA_SEED_CINEVERSE: process.env.LUMORA_SEED_CINEVERSE,
    LUMORA_SEED_ECHO: process.env.LUMORA_SEED_ECHO,
    LUMORA_SEED_FYP: process.env.LUMORA_SEED_FYP,
    LUMORA_SEED_VIDEOS: process.env.LUMORA_SEED_VIDEOS,
    LUMORA_SEED_GMAR: process.env.LUMORA_SEED_GMAR,
    LUMORA_SEED_NEXA: process.env.LUMORA_SEED_NEXA,
    LUMORA_SEED_LIVE: process.env.LUMORA_SEED_LIVE,
  } as const;

  const mode = normalizeMode(raw.LUMORA_DATA_MODE);

  // In seed mode, defaults are true; otherwise defaults are false.
  const seedDefault = mode === "seed";

  return {
    mode,
    seed: {
      cineverse: envBool(raw.LUMORA_SEED_CINEVERSE, seedDefault),
      echo: envBool(raw.LUMORA_SEED_ECHO, seedDefault),
      fyp: envBool(raw.LUMORA_SEED_FYP, seedDefault),
      videos: envBool(raw.LUMORA_SEED_VIDEOS, seedDefault),
      gmar: envBool(raw.LUMORA_SEED_GMAR, seedDefault),
      nexa: envBool(raw.LUMORA_SEED_NEXA, seedDefault),
      live: envBool(raw.LUMORA_SEED_LIVE, seedDefault),
    },
    raw,
  };
}

export function getLumoraDataMode(): LumoraDataMode {
  return getDataModeInfo().mode;
}

export function isSeedMode(): boolean {
  return getLumoraDataMode() === "seed";
}

export function canUseSeed(portal: keyof DataModeInfo["seed"]): boolean {
  const info = getDataModeInfo();
  return info.mode === "seed" && info.seed[portal] === true;
}
