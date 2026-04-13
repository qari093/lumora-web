import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";
import type { LumoraNativeTransformationType } from "./lumoraNativeTransformationRegistry";

export type TransformInsteadOfDisplayInput = {
  metadata: ExtractedTeaserMetadata;
  trigger:
    | "rights_restriction"
    | "cultural_risk"
    | "media_unavailable"
    | "ops_override";
  preferredTransformation?: LumoraNativeTransformationType;
};

export type TransformInsteadOfDisplayResult = {
  transformed: true;
  transformationType: LumoraNativeTransformationType;
  sourceRef: string;
  title: string;
  trigger: TransformInsteadOfDisplayInput["trigger"];
};

function chooseTransformationType(
  input: TransformInsteadOfDisplayInput
): LumoraNativeTransformationType {
  if (input.preferredTransformation) return input.preferredTransformation;

  if (input.trigger === "media_unavailable") return "teaser-recap";
  if (input.trigger === "cultural_risk") return "why-this-is-heating";
  if (input.trigger === "rights_restriction") return "fandom-pulse-recap";
  return "trend-to-film";
}

export function applyTransformInsteadOfDisplay(
  input: TransformInsteadOfDisplayInput
): TransformInsteadOfDisplayResult {
  const transformationType = chooseTransformationType(input);

  return {
    transformed: true,
    transformationType,
    sourceRef:
      input.metadata.canonicalUrl ||
      input.metadata.teaserUrl ||
      `metadata:${input.metadata.category}:${input.metadata.title}`,
    title: input.metadata.title,
    trigger: input.trigger,
  };
}

export function shouldTransformInsteadOfDisplay(
  trigger: TransformInsteadOfDisplayInput["trigger"]
): boolean {
  return (
    trigger === "rights_restriction" ||
    trigger === "cultural_risk" ||
    trigger === "media_unavailable" ||
    trigger === "ops_override"
  );
}
