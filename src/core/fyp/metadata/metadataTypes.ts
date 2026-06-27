import type { FypEmotionalLane } from "../lanes/laneRegistry";

export interface FypMetadataInput {
  id: string;
  title: string;
  description?: string;
  source: string;
  playbackUrl: string;
  durationSeconds: number;
}

export interface FypEnrichedMetadata {
  id: string;
  title: string;
  source: string;
  playbackUrl: string;
  durationSeconds: number;
  primaryLane: FypEmotionalLane;
  attribution: string;
  qualityScore: number;
}
