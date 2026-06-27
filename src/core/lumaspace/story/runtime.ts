export type StoryStarKind = "memory" | "dream" | "friend" | "milestone" | "portal";

export type StoryStar = {
  id: string;
  title: string;
  kind: StoryStarKind;
  x: number;
  y: number;
  weight: "soft" | "bright" | "planet" | "core";
};

export const storyStars: StoryStar[] = [
  { id: "nebula", title: "Nebula", kind: "memory", x: 50, y: 18, weight: "bright" },
  { id: "first-friend", title: "First Friend", kind: "friend", x: 24, y: 48, weight: "planet" },
  { id: "dream", title: "Dream", kind: "dream", x: 74, y: 45, weight: "soft" },
  { id: "gmar", title: "GMAR Victory", kind: "milestone", x: 62, y: 72, weight: "bright" },
  { id: "zendoro", title: "Zendoro Dream", kind: "portal", x: 36, y: 76, weight: "core" }
];

export function getImportantStars(stars: StoryStar[] = storyStars): StoryStar[] {
  return stars.filter((star) => star.weight === "planet" || star.weight === "core");
}
