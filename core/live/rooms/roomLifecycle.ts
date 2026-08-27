import { transitionRoom } from "./stableRoomLifecycle";

export function createRoom(id: string) {
  const transition = transitionRoom("scheduled", "live");

  return {
    id,
    active: transition.ok,
    state: transition.ok ? "live" : "scheduled"
  };
}
