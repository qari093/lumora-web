import type { GmarGameState } from "@/src/core/gmar/state/gameState";

export type GmarWorldZone = {
  zoneId: string;
  name: string;
  unlocked: boolean;
};

export type GmarLiveEvent = {
  eventId: string;
  title: string;
  zoneId: string;
  startsAt: string;
  endsAt: string;
  rewardZencoin: number;
  active: boolean;
};

export const GMAR_WORLD_ZONES: GmarWorldZone[] = [
  {
    zoneId: "arrival_gate",
    name: "Arrival Gate",
    unlocked: true
  },
  {
    zoneId: "origin_fields",
    name: "Origin Fields",
    unlocked: true
  }
];

export const GMAR_LIVE_EVENTS: GmarLiveEvent[] = [
  {
    eventId: "origin_storm",
    title: "Origin Storm",
    zoneId: "arrival_gate",
    startsAt: "2026-05-09T00:00:00.000Z",
    endsAt: "2026-05-16T00:00:00.000Z",
    rewardZencoin: 10,
    active: true
  }
];

export function getGmarLiveEvent(eventId: string): GmarLiveEvent {
  const event = GMAR_LIVE_EVENTS.find(item => item.eventId === eventId);

  if (!event) {
    throw new Error("GMAR live event not found.");
  }

  if (!event.active) {
    throw new Error("GMAR live event is not active.");
  }

  return event;
}

export function joinGmarLiveEvent(input: {
  state: GmarGameState;
  eventId: string;
}): GmarGameState {
  const event = getGmarLiveEvent(input.eventId);

  const zone = GMAR_WORLD_ZONES.find(item => item.zoneId === event.zoneId);

  if (!zone || zone.unlocked !== true) {
    throw new Error("GMAR event zone is locked.");
  }

  return {
    ...input.state,
    world: {
      ...input.state.world,
      zoneId: event.zoneId,
      eventId: event.eventId,
      lastCheckpoint: event.zoneId
    },
    updatedAt: new Date().toISOString()
  };
}

export function assertGmarWorldEventState(state: GmarGameState): true {
  if (
    !state.world.worldId ||
    !state.world.zoneId ||
    state.world.eventId !== "origin_storm"
  ) {
    throw new Error("Invalid GMAR world event state.");
  }

  return true;
}
