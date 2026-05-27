export const LIGHT_PRESENCE_DRIFT_MS = 14 * 24 * 60 * 60 * 1000;

export function enableLightPresenceMode(creatorId: string) {
  return { creatorId, enabled: true, mode: "light-presence" };
}

export function trackPassivePresence(creatorId: string, nowMs = Date.now()) {
  return { creatorId, passive: true, lastSeenAtMs: nowMs };
}

export function dimSilhouettesInUi(ids: string[]) {
  return Array.from(new Set(ids)).map((id) => ({
    id,
    dimmed: true,
    opacity: 0.35,
  }));
}

export function detectLightPresenceDrift(lastActiveAtMs: number, nowMs: number) {
  return { drifted: nowMs - lastActiveAtMs >= LIGHT_PRESENCE_DRIFT_MS };
}

export function validateLightPresenceIntegration(input: {
  mode?: { enabled?: boolean };
  passive?: { passive?: boolean };
  silhouettes?: unknown[];
  drift?: { drifted?: boolean };
}) {
  return {
    ok:
      input.mode?.enabled === true &&
      input.passive?.passive === true &&
      Array.isArray(input.silhouettes) &&
      typeof input.drift?.drifted === "boolean",
  };
}
