export type RoomConstellation = {
  roomId: string;
  anonymousPresence: number;
  pattern: "spiral" | "arc" | "wave";
};

export function createRoomConstellation(roomId: string, count: number): RoomConstellation {
  return {
    roomId,
    anonymousPresence: Math.max(0, count),
    pattern: count > 25 ? "spiral" : count > 10 ? "wave" : "arc"
  };
}
