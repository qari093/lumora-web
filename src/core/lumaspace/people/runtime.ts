export type CircleKind = "family" | "dream" | "creator" | "gaming" | "closest";
export type SharedWorldMood = "wonder" | "calm" | "dream" | "focus" | "healing";

export type LumaCircle = {
  id: string;
  name: string;
  kind: CircleKind;
  members: string[];
};

export type SharedWorld = {
  id: string;
  title: string;
  mood: SharedWorldMood;
  circleId: string;
  memories: string[];
  dreamBoard: string[];
};

export type WorldRipple = {
  id: string;
  from: string;
  mood: SharedWorldMood;
  message: string;
};

export const lumaCircles: LumaCircle[] = [
  { id: "closest", name: "Closest Circle", kind: "closest", members: ["Ayesha", "Sara"] },
  { id: "dream", name: "Dream Partners", kind: "dream", members: ["Zayan"] },
  { id: "creator", name: "Creator Allies", kind: "creator", members: ["Hamza"] },
  { id: "gaming", name: "Gaming Squad", kind: "gaming", members: ["GMAR Team"] }
];

export const sharedWorlds: SharedWorld[] = [
  {
    id: "shared-wonder",
    title: "Shared Wonder World",
    mood: "wonder",
    circleId: "closest",
    memories: ["Nebula", "First Star"],
    dreamBoard: ["Build a peaceful universe"]
  },
  {
    id: "creator-dream",
    title: "Creator Dream Space",
    mood: "focus",
    circleId: "creator",
    memories: ["First Prototype"],
    dreamBoard: ["Launch Lumora"]
  }
];

export function getCircleById(id: string): LumaCircle {
  const circle = lumaCircles.find((item) => item.id === id);
  if (!circle) throw new Error(`Unknown circle: ${id}`);
  return circle;
}

export function createWorldRipple(from: string, mood: SharedWorldMood): WorldRipple {
  return {
    id: `${from.toLowerCase()}-${mood}-ripple`,
    from,
    mood,
    message: `${from} sent a ${mood} ripple through your universe.`
  };
}

export function getSharedWorldsForCircle(circleId: string): SharedWorld[] {
  return sharedWorlds.filter((world) => world.circleId === circleId);
}
