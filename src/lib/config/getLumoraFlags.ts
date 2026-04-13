import { DEFAULT_LUMORA_FLAGS, type LumoraFlags, type LumoraFlagKey } from "@/config/lumoraFlags";

const ENV_PREFIX = "NEXT_PUBLIC_LUMORA_FLAG_";

function parseFlag(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === "") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

export function getLumoraFlags(): LumoraFlags {
  const flags: Partial<LumoraFlags> = {};

  (Object.keys(DEFAULT_LUMORA_FLAGS) as LumoraFlagKey[]).forEach((key) => {
    const envKey = `${ENV_PREFIX}${key}`;
    flags[key] = parseFlag(process.env[envKey], DEFAULT_LUMORA_FLAGS[key]);
  });

  return flags as LumoraFlags;
}
