export type IdentityShadowProfileMergeInput = {
  explicitAffinities: string[];
  shadowAffinities: string[];
  explicitVibeTags: string[];
  shadowVibeTags: string[];
  explicitIntensity?: "low" | "balanced" | "high";
  shadowIntensity?: "low" | "balanced" | "high";
};

export type IdentityShadowProfileMergeResult = {
  affinities: string[];
  vibeTags: string[];
  intensity: "low" | "balanced" | "high";
};

function uniqueOrdered(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = raw.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

export function mergeIdentityShadowProfile(
  input: IdentityShadowProfileMergeInput
): IdentityShadowProfileMergeResult {
  const affinities = uniqueOrdered([
    ...input.explicitAffinities,
    ...input.shadowAffinities,
  ]).slice(0, 8);

  const vibeTags = uniqueOrdered([
    ...input.explicitVibeTags,
    ...input.shadowVibeTags,
  ]).slice(0, 16);

  const intensity =
    input.explicitIntensity ||
    input.shadowIntensity ||
    "balanced";

  return {
    affinities,
    vibeTags,
    intensity,
  };
}

export function hasMergedIdentityShadowProfile(
  result: IdentityShadowProfileMergeResult
): boolean {
  return result.affinities.length > 0 || result.vibeTags.length > 0;
}
