export type LiveRoom = {
  id: string;
  title: string;
  topic: string;
  lang: string;
  capacity: number;
  isGameRoom: boolean;
};

export const SEED_LIVE_ROOMS: LiveRoom[] = [
  { id: "room_001", title: "Lumora Live — Lobby", topic: "Community", lang: "EN", capacity: 250, isGameRoom: false },
  { id: "room_002", title: "GMAR Arena — Hangout", topic: "Games", lang: "EN", capacity: 150, isGameRoom: true },
  { id: "room_003", title: "NEXA Focus Room", topic: "Wellness", lang: "EN", capacity: 120, isGameRoom: false },
  { id: "room_004", title: "CineVerse Watch Party", topic: "Movies", lang: "HI", capacity: 200, isGameRoom: false },
  { id: "room_005", title: "Lumora Echo Listening Room", topic: "Music", lang: "PA", capacity: 180, isGameRoom: false },
];

export function getSeedRooms(): LiveRoom[] {
  return SEED_LIVE_ROOMS.slice();
}

export function getRoomById(id: string): LiveRoom | null {
  const x = (id || "").trim();
  if (!x) return null;
  return SEED_LIVE_ROOMS.find((r) => r.id === x) ?? null;
}
