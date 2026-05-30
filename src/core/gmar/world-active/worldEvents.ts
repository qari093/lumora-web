export const GMAR_WORLD_ZONES = [{ worldId: "gmar_origin_realm", zoneId: "arrival_gate", name: "Arrival Gate" }];
export const GMAR_LIVE_EVENTS = [{ eventId: "origin_storm", worldId: "gmar_origin_realm", zoneId: "arrival_gate", active: true }];

export function getGmarLiveEvent(eventId: string) {
  const event = GMAR_LIVE_EVENTS.find(e => e.eventId === eventId);
  if (!event) throw new Error("GMAR live event not found.");
  return event;
}

export function joinGmarLiveEvent(input: any) {
  const event = getGmarLiveEvent(String(input?.eventId ?? ""));
  return {
    ...(input?.state ?? {}),
    world: { worldId: event.worldId, zoneId: event.zoneId, eventId: event.eventId, active: true },
    activeEvent: event
  };
}

export function assertGmarWorldEventState(state: any): boolean {
  return Boolean(state?.world?.worldId === "gmar_origin_realm" && state?.world?.zoneId === "arrival_gate" && state?.world?.eventId === "origin_storm");
}

export const joinGmarWorldEvent = joinGmarLiveEvent;

