export type LumoraFlags = {
  ENABLE_AI: boolean;
  ENABLE_ADS: boolean;
  ENABLE_ZENCOIN: boolean;
  LUMORA_MODE: string;
};

function bool(value: string | undefined, fallback = false): boolean {
  if (value == null) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function getLumoraFlags(): LumoraFlags {
  return {
    ENABLE_AI: bool(process.env.ENABLE_AI, false),
    ENABLE_ADS: bool(process.env.ENABLE_ADS, false),
    ENABLE_ZENCOIN: bool(process.env.ENABLE_ZENCOIN, true),
    LUMORA_MODE: process.env.LUMORA_MODE || process.env.NODE_ENV || "production"
  };
}

export default getLumoraFlags;
