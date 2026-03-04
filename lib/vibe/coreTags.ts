export type VibeTagLite = {
  slug: string;
  label: string;
  category: "AWE" | "WARMTH" | "ENERGY" | "INSIGHT";
  intensity: number;
};

export const CORE_VIBE_TAGS: VibeTagLite[] = [
  { slug: "mind-open", label: "Mind Open", category: "AWE", intensity: 4 },
  { slug: "plot-twist", label: "Plot Twist", category: "AWE", intensity: 4 },
  { slug: "unreal", label: "Unreal", category: "AWE", intensity: 4 },

  { slug: "wholesome", label: "Wholesome", category: "WARMTH", intensity: 4 },
  { slug: "pure", label: "Pure", category: "WARMTH", intensity: 3 },
  { slug: "respect", label: "Respect", category: "WARMTH", intensity: 3 },

  { slug: "vibing", label: "Vibing", category: "ENERGY", intensity: 3 },
  { slug: "savage", label: "Savage", category: "ENERGY", intensity: 3 },

  { slug: "thats-deep", label: "That’s Deep", category: "INSIGHT", intensity: 4 },
  { slug: "rewatch-worthy", label: "Rewatch Worthy", category: "INSIGHT", intensity: 3 },
];
