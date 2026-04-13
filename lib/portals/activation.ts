export type PortalKey =
  | "FYP"
  | "LIVE"
  | "GMAR"
  | "NEXA"
  | "MOVIES"
  | "MUSIC";

export type PortalActivationInput = {
  enabledPortals?: string[] | null;
};

export type PortalState = {
  key: PortalKey;
  enabled: boolean;
};

export type PortalActivationResult =
  | { ok: true; portals: PortalState[] }
  | { ok: false; reason: string };

const ALL_PORTALS: PortalKey[] = [
  "FYP",
  "LIVE",
  "GMAR",
  "NEXA",
  "MOVIES",
  "MUSIC",
];

export function resolvePortalActivation(
  input: PortalActivationInput
): PortalActivationResult {
  const enabledRaw = Array.isArray(input.enabledPortals)
    ? input.enabledPortals.map((p) => String(p).trim().toUpperCase())
    : [];

  const invalid = enabledRaw.filter((p) => !ALL_PORTALS.includes(p as PortalKey));
  if (invalid.length > 0) {
    return { ok: false, reason: "invalid_portal_key" };
  }

  const enabledSet = new Set<PortalKey>(enabledRaw as PortalKey[]);

  const portals = ALL_PORTALS.map((key) => ({
    key,
    enabled: enabledSet.has(key),
  }));

  return { ok: true, portals };
}
