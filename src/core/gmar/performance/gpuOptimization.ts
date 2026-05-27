export function gpuTier(score: number) {
  if (score >= 90) return "ultra";

  if (score >= 60) return "high";

  return "balanced";
}
