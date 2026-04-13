export type IdentityConflictResolutionRulesInput = {
  explicitIntensity?: "low" | "balanced" | "high";
  adaptiveIntensity?: "low" | "balanced" | "high";
  explicitAffinities: string[];
  adaptiveAffinities: string[];
  explicitVibeTags: string[];
  adaptiveVibeTags: string[];
  explicitPriority: boolean;
};

export type IdentityConflictResolutionRulesResult = {
  resolvedIntensity: "low" | "balanced" | "high";
  resolvedAffinities: string[];
  resolvedVibeTags: string[];
  reason:
    | "explicit_priority"
    | "adaptive_priority"
    | "merged_balanced";
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

export function resolveIdentityConflicts(
  input: IdentityConflictResolutionRulesInput
): IdentityConflictResolutionRulesResult {
  if (input.explicitPriority) {
    return {
      resolvedIntensity:
        input.explicitIntensity ||
        input.adaptiveIntensity ||
        "balanced",
      resolvedAffinities: uniqueOrdered([
        ...input.explicitAffinities,
        ...input.adaptiveAffinities,
      ]).slice(0, 8),
      resolvedVibeTags: uniqueOrdered([
        ...input.explicitVibeTags,
        ...input.adaptiveVibeTags,
      ]).slice(0, 16),
      reason: "explicit_priority",
    };
  }

  if (
    input.adaptiveIntensity ||
    input.adaptiveAffinities.length > 0 ||
    input.adaptiveVibeTags.length > 0
  ) {
    return {
      resolvedIntensity:
        input.adaptiveIntensity ||
        input.explicitIntensity ||
        "balanced",
      resolvedAffinities: uniqueOrdered([
        ...input.adaptiveAffinities,
        ...input.explicitAffinities,
      ]).slice(0, 8),
      resolvedVibeTags: uniqueOrdered([
        ...input.adaptiveVibeTags,
        ...input.explicitVibeTags,
      ]).slice(0, 16),
      reason: "adaptive_priority",
    };
  }

  return {
    resolvedIntensity:
      input.explicitIntensity ||
      input.adaptiveIntensity ||
      "balanced",
    resolvedAffinities: uniqueOrdered([
      ...input.explicitAffinities,
      ...input.adaptiveAffinities,
    ]).slice(0, 8),
    resolvedVibeTags: uniqueOrdered([
      ...input.explicitVibeTags,
      ...input.adaptiveVibeTags,
    ]).slice(0, 16),
    reason: "merged_balanced",
  };
}

export function hasResolvedIdentityConflicts(
  result: IdentityConflictResolutionRulesResult
): boolean {
  return (
    result.resolvedIntensity.length > 0 &&
    (result.resolvedAffinities.length > 0 || result.resolvedVibeTags.length > 0)
  );
}
