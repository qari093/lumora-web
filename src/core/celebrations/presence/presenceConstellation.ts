export function createPresenceLight(id = "anonymous") {
  return {
    id,
    glow: true,
    orbit: "soft",
    presenceOnly: true
  } as const;
}

export function createPresenceConstellation(ids: string[] = []) {
  return {
    active: true,
    lights: ids.map(createPresenceLight),
    behavior: "quiet-orbit"
  } as const;
}
