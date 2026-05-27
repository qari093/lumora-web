export type LiveRoomKind = "broadcast" | "presence" | "watch_world" | "pulse_event";

export type LiveRoom = {
  id: string;
  title: string;
  kind: LiveRoomKind;
  activeUsers: number;
  emotionalState: "calm" | "warm" | "electric" | "focused";
};

export const DEFAULT_LIVE_ROOMS: LiveRoom[] = [
  { id: "presence-calm", title: "Calm Presence", kind: "presence", activeUsers: 0, emotionalState: "calm" },
  { id: "watch-world", title: "Watch World", kind: "watch_world", activeUsers: 0, emotionalState: "warm" },
  { id: "pulse-event", title: "Pulse Event", kind: "pulse_event", activeUsers: 0, emotionalState: "electric" },
];

export function getLiveRooms(): LiveRoom[] {
  return DEFAULT_LIVE_ROOMS;
}

export function findLiveRoom(roomId: string): LiveRoom | null {
  return DEFAULT_LIVE_ROOMS.find((room) => room.id === roomId) ?? null;
}
