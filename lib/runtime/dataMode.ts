export type LumoraDataMode = "seed" | "mock" | "live";

export function getLumoraDataMode(): LumoraDataMode {
  const mode = process.env.LUMORA_DATA_MODE;
  if (mode === "live" || mode === "mock" || mode === "seed") return mode;
  return "seed";
}

export function isSeedMode() {
  return getLumoraDataMode() === "seed";
}

export function isMockMode() {
  return getLumoraDataMode() === "mock";
}

export function isLiveMode() {
  return getLumoraDataMode() === "live";
}
