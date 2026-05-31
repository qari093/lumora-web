import type { CircleBloom, EchoCircleTheme } from "./types";

const SHAPE_BY_THEME: Record<EchoCircleTheme, CircleBloom["bloomShape"]> = {
  hope: "star",
  grief: "orb",
  creative_fire: "spiral",
  starting_over: "leaf",
  gratitude: "thread",
  belonging: "orb",
  focus: "leaf",
};

export function createCircleBloom(input: {
  citizenId: string;
  circleId: string;
  theme: EchoCircleTheme;
}): CircleBloom {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");
  if (!input.circleId.trim()) throw new Error("circleId_required");

  return {
    id: `circle_bloom_${input.citizenId}_${input.circleId}`,
    citizenId: input.citizenId,
    circleId: input.circleId,
    theme: input.theme,
    bloomShape: SHAPE_BY_THEME[input.theme],
    privateByDefault: true,
  };
}
