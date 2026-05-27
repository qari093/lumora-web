export type RoomMoodRing = {
  dominant: "still" | "warm" | "curious" | "heavy" | "amused";
  intensity: number; // 0..1
};

export function buildRoomMoodRing(input: {
  counts: Record<string, number>;
}): RoomMoodRing {
  const entries = Object.entries(input.counts || {});
  if (entries.length === 0) return { dominant: "still", intensity: 0 };

  const [dom, val] = entries.sort((a,b)=>b[1]-a[1])[0];
  const total = entries.reduce((s,[,v])=>s+v,0) || 1;

  return {
    dominant: (dom as RoomMoodRing["dominant"]) || "still",
    intensity: Math.max(0, Math.min(1, val / total)),
  };
}
