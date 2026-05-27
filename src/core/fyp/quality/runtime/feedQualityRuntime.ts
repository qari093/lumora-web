import type {
  FeedQualityDecision,
  FeedQualityInput
} from "../types";

import { calculateFeedQuality } from "./feedQualityScore";

export function runFeedQualityRuntime(
  inputs: FeedQualityInput[]
): FeedQualityDecision[] {
  return inputs
    .map(calculateFeedQuality)
    .sort((a, b) => b.score - a.score);
}
