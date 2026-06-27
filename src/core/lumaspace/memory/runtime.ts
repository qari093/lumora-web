export type StarWeight = "soft" | "bright" | "planet" | "core";

export type StoryStar = {
  id: string;
  title: string;
  x: number;
  y: number;
  weight: StarWeight;
};

export const storyStars: StoryStar[] = [
  { id: "nebula", title: "Nebula", x: 50, y: 18, weight: "bright" },
  { id: "first-friend", title: "First Friend", x: 24, y: 48, weight: "planet" },
  { id: "dream", title: "Dream", x: 74, y: 45, weight: "soft" },
  { id: "gmar", title: "GMAR Victory", x: 62, y: 72, weight: "bright" },
  { id: "zendoro", title: "Zendoro Dream", x: 36, y: 76, weight: "core" }
];

export function getImportantStars(stars: StoryStar[] = storyStars): StoryStar[] {
  return stars.filter((star) => star.weight === "planet" || star.weight === "core");
}
