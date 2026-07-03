import type { MemoryConstellation, MemoryStar } from "./types";

export function createMemoryConstellation(
  title: string,
  stars: MemoryStar[],
  contributors: string[],
): MemoryConstellation {
  const lines = stars.slice(1).map((star, index) => ({
    from: stars[index].id,
    to: star.id,
    strength: Number(Math.min(1, (stars[index].brightness + star.brightness) / 2).toFixed(4)),
  }));

  return {
    id: `memory_constellation_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    title,
    stars,
    lines,
    contributors: Array.from(new Set(contributors)),
  };
}

export function addStarToConstellation(
  constellation: MemoryConstellation,
  star: MemoryStar,
  contributorId: string,
): MemoryConstellation {
  const stars = [...constellation.stars.filter((item) => item.id !== star.id), star];

  return createMemoryConstellation(constellation.title, stars, [...constellation.contributors, contributorId]);
}
