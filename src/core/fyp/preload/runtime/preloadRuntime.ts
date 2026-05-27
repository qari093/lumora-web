import type {
  PreloadCandidate,
  PreloadDecision
} from "../types";

import {
  evaluatePreloadCandidate
} from "./preloadPolicy";

export function runPreloadRuntime(
  candidates: PreloadCandidate[]
): PreloadDecision[] {
  return candidates.map(evaluatePreloadCandidate);
}
