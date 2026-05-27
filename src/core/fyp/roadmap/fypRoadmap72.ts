export type FypRoadmapLayer =
  | "engine_creation"
  | "production_operationalization"
  | "optional_evolution";

export type FypRoadmapSegment = {
  id: string;
  title: string;
  fromPack: number;
  toPack: number;
  layer: FypRoadmapLayer;
  requiredForLaunch: boolean;
};

export const LUMORA_FYP_TOTAL_PACKS = 72;
export const LUMORA_FYP_REQUIRED_PRODUCTION_PACKS = 40;
export const LUMORA_FYP_ENGINE_CREATION_PACKS = 32;
export const LUMORA_FYP_OPTIONAL_EVOLUTION_PACKS = 32;

export const LUMORA_FYP_72_PACK_SEGMENTS: FypRoadmapSegment[] = [
  {
    id: "engine_creation",
    title: "Engine Creation Layer",
    fromPack: 1,
    toPack: 32,
    layer: "engine_creation",
    requiredForLaunch: true
  },
  {
    id: "production_operationalization",
    title: "Production Operationalization Layer",
    fromPack: 33,
    toPack: 40,
    layer: "production_operationalization",
    requiredForLaunch: true
  },
  {
    id: "smarter_ai",
    title: "Smarter AI Systems",
    fromPack: 41,
    toPack: 48,
    layer: "optional_evolution",
    requiredForLaunch: false
  },
  {
    id: "deeper_personalization",
    title: "Deeper Personalization",
    fromPack: 49,
    toPack: 54,
    layer: "optional_evolution",
    requiredForLaunch: false
  },
  {
    id: "experimental_modes",
    title: "Experimental Modes",
    fromPack: 55,
    toPack: 58,
    layer: "optional_evolution",
    requiredForLaunch: false
  },
  {
    id: "future_ux_evolution",
    title: "Future UX Evolution",
    fromPack: 59,
    toPack: 62,
    layer: "optional_evolution",
    requiredForLaunch: false
  },
  {
    id: "advanced_prediction_systems",
    title: "Advanced Prediction Systems",
    fromPack: 63,
    toPack: 72,
    layer: "optional_evolution",
    requiredForLaunch: false
  }
];

export function assertLumoraFyp72Roadmap(): boolean {
  const firstPack = Math.min(...LUMORA_FYP_72_PACK_SEGMENTS.map(segment => segment.fromPack));
  const lastPack = Math.max(...LUMORA_FYP_72_PACK_SEGMENTS.map(segment => segment.toPack));

  const requiredLastPack = Math.max(
    ...LUMORA_FYP_72_PACK_SEGMENTS
      .filter(segment => segment.requiredForLaunch)
      .map(segment => segment.toPack)
  );

  return (
    firstPack === 1 &&
    lastPack === LUMORA_FYP_TOTAL_PACKS &&
    requiredLastPack === LUMORA_FYP_REQUIRED_PRODUCTION_PACKS &&
    LUMORA_FYP_ENGINE_CREATION_PACKS === 32 &&
    LUMORA_FYP_OPTIONAL_EVOLUTION_PACKS === 32
  );
}
