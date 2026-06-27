import { classifyLane } from "../lanes/laneClassifier";
import type {
  FypMetadataInput,
  FypEnrichedMetadata
} from "./metadataTypes";

export function enrichFypMetadata(
  input: FypMetadataInput
): FypEnrichedMetadata {
  const primaryLane = classifyLane({
    title: input.title,
    description: input.description
  });

  const durationScore =
    input.durationSeconds >= 10 && input.durationSeconds <= 60 ? 0.35 : 0.15;

  const urlScore = input.playbackUrl.startsWith("http") ? 0.35 : 0.15;
  const sourceScore = input.source.trim().length > 0 ? 0.30 : 0;

  return {
    id: input.id,
    title: input.title,
    source: input.source,
    playbackUrl: input.playbackUrl,
    durationSeconds: input.durationSeconds,
    primaryLane,
    attribution: `Video source: ${input.source}`,
    qualityScore: Number((durationScore + urlScore + sourceScore).toFixed(2))
  };
}
