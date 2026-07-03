import {
  createCanonicalVideoAsset,
  createVideoLicense,
  type CanonicalVideoAsset,
} from "../runtime";
import { upsertCanonicalVideo } from "./runtime";

export type ValidationPoolLane =
  | "genesis"
  | "serenity"
  | "wonder"
  | "spectacle"
  | "edge_case";

export type ValidationPoolSeed = {
  lane: ValidationPoolLane;
  count: number;
};

const validationPoolPlan: ValidationPoolSeed[] = [
  { lane: "genesis", count: 10 },
  { lane: "serenity", count: 10 },
  { lane: "wonder", count: 10 },
  { lane: "spectacle", count: 5 },
  { lane: "edge_case", count: 5 },
];

function laneMetadata(lane: ValidationPoolLane) {
  if (lane === "genesis") return { serenity: 0.9, wonder: 0.82, spectacle: 0.12 };
  if (lane === "serenity") return { serenity: 0.88, wonder: 0.45, spectacle: 0.08 };
  if (lane === "wonder") return { serenity: 0.72, wonder: 0.9, spectacle: 0.25 };
  if (lane === "spectacle") return { serenity: 0.62, wonder: 0.74, spectacle: 0.58 };
  return { serenity: 0.65, wonder: 0.52, spectacle: 0.35, edgeCase: true };
}

export function createValidationMediaAsset(lane: ValidationPoolLane, index: number): CanonicalVideoAsset {
  const sourceAssetId = `validation_${lane}_${String(index).padStart(2, "0")}`;

  return createCanonicalVideoAsset({
    providerId: "validation_pool",
    sourceAssetId,
    sourceUrl: `lumora://validation-media/${sourceAssetId}.mp4`,
    title: `Validation ${lane} ${index}`,
    description: `Controlled ${lane} validation media for FYP and LumaSpace testing.`,
    durationSeconds: lane === "edge_case" ? 12 + index : 30 + index,
    width: lane === "edge_case" && index % 2 === 0 ? 720 : 1920,
    height: lane === "edge_case" && index % 2 === 0 ? 1280 : 1080,
    hasAudio: true,
    mimeType: "video/mp4",
    attribution: "Lumora Validation Media Pool",
    license: createVideoLicense({
      id: "lumora-validation-owned",
      label: "Lumora Validation Owned",
      commercialUse: true,
      derivativesAllowed: true,
      attributionRequired: false,
      sourceUrl: "lumora://licenses/validation-media",
    }),
    tags: ["validation", lane, "fyp", "lumaspace"],
    metadata: {
      validationPool: true,
      lane,
      voiceCheckRequired: true,
      shareFlowRequired: true,
      ...laneMetadata(lane),
    },
  });
}

export function createValidationMediaPool() {
  return validationPoolPlan.flatMap((seed) =>
    Array.from({ length: seed.count }, (_, index) =>
      createValidationMediaAsset(seed.lane, index + 1),
    ),
  );
}

export function seedValidationMediaPool() {
  const assets = createValidationMediaPool();
  const records = assets.map((asset) => upsertCanonicalVideo(asset));

  return {
    total: records.length,
    lanes: validationPoolPlan,
    records,
  };
}
