import type { HomeBeaconConfig } from "./types";

export const HOME_BEACON_FLAG = "NEXT_PUBLIC_LUMORA_HOME_BEACON";

export const DEFAULT_HOME_BEACON_CONFIG: HomeBeaconConfig = {
  enabled: true,
  breathingMs: 4800,
  position: "bottom-center",
  bladeCore: true,
  homeShell: true,
  portalReady: true,
};

export function isHomeBeaconEnabled(env: Record<string, string | undefined> = process.env): boolean {
  const raw = env[HOME_BEACON_FLAG];
  if (!raw) return true;
  return ["1", "true", "yes", "enabled"].includes(raw.toLowerCase());
}
