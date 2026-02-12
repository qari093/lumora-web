export type LiveRoom = {
  id: string;
  title: string;
  topic?: string;
  cta?: string;
};

function coerceRoom(x: any): LiveRoom {
  const id = typeof x?.id === "string" && x.id ? x.id : "room-1";
  const title =
    typeof x?.title === "string" && x.title
      ? x.title
      : typeof x?.name === "string" && x.name
        ? x.name
        : "Live Room";
  const topic = typeof x?.topic === "string" ? x.topic : undefined;
  const cta =
    typeof x?.cta === "string" && x.cta
      ? x.cta
      : typeof x?.href === "string" && x.href
        ? x.href
        : `/live/room/${encodeURIComponent(id)}`;
  return { id, title, topic, cta };
}

export async function loadLiveRooms(): Promise<LiveRoom[]> {
  // Seed-safe fallback for build/test environments (no filesystem dependency).
  // If you later add DB/redis/live discovery, keep this function signature stable.
  const seed = [
    { id: "lobby", title: "Lumora LIVE Lobby", topic: "Community rooms", cta: "/live" },
    { id: "gmar", title: "GMAR Room", topic: "Games + squads", cta: "/gmar" },
  ];
  return seed.map(coerceRoom);
}
