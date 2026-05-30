export function activateAbility(name: string = "pulse_dash") {
  return {
    abilityId: name,
    active: true,
    cooldownMs: 1200
  };
}

export function createBoss(name: string = "Origin Warden") {
  return {
    bossId: "origin_warden",
    name,
    health: 100,
    active: true
  };
}

export function launchWorldEvent(eventId: string = "origin_storm") {
  return {
    eventId,
    active: true,
    zoneId: "arrival_gate"
  };
}

export function resolveMusic(intensity: number): "ambient" | "explore" | "combat" {
  const value = Number(intensity);
  if (value >= 80) return "combat";
  if (value >= 40) return "explore";
  return "ambient";
}

export function protectThermals(temp: number = 37) {
  return {
    safe: Number(temp) < 45,
    throttled: Number(temp) >= 45
  };
}
