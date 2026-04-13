export type ContextOverlay = {
  label: string;
  value: string;
  position: "top_left" | "top_right" | "bottom_left" | "bottom_right";
};

export function buildContextOverlay(input: {
  category?: string;
  region?: string;
  language?: string;
}): ContextOverlay[] {
  return [
    {
      label: "Category",
      value: input.category || "general",
      position: "top_left",
    },
    {
      label: "Region",
      value: input.region || "global",
      position: "top_right",
    },
    {
      label: "Language",
      value: input.language || "en",
      position: "bottom_left",
    },
  ];
}
