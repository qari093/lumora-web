export const PORTALS = [
  { key: "fyp", enabled: true },
  { key: "gmar", enabled: true },
  { key: "nexa", enabled: true },
  { key: "cineverse", enabled: true },
  { key: "live", enabled: true },
  { key: "wallet", enabled: true },
  { key: "profile", enabled: true }
] as const;

export type PortalKey = typeof PORTALS[number]["key"];
