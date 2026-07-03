import type { MemoryStar, SharedGarden } from "./types";

export function createSharedGarden(ownerId: string, title: string, flowers: MemoryStar[] = []): SharedGarden {
  const atmosphere = flowers[0]?.atmosphere ?? "calm-garden";

  return {
    id: `shared_garden_${ownerId}_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    ownerId,
    title,
    flowers,
    atmosphere,
    growthScore: Number(Math.min(1, flowers.length * 0.12).toFixed(4)),
  };
}

export function plantMemoryInGarden(garden: SharedGarden, star: MemoryStar): SharedGarden {
  const flowers = [...garden.flowers.filter((item) => item.id !== star.id), star];

  return {
    ...garden,
    flowers,
    atmosphere: star.atmosphere,
    growthScore: Number(Math.min(1, flowers.length * 0.12 + flowers.reduce((sum, item) => sum + item.brightness, 0) * 0.03).toFixed(4)),
  };
}
