export type MoodBoardVibeSignal = {
  tag: string;
  weight: number;
};

export type MoodBoardVibeBlendResult = {
  blendedVibes: MoodBoardVibeSignal[];
  dominantVibe: string | null;
};

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

export function blendMoodBoardVibes(
  sources: MoodBoardVibeSignal[],
  limit = 8
): MoodBoardVibeBlendResult {
  const weights = new Map<string, number>();

  for (const source of sources) {
    const tag = normalizeTag(source.tag);
    if (!tag) continue;
    const weight = Math.max(0, Number(source.weight) || 0);
    weights.set(tag, (weights.get(tag) ?? 0) + weight);
  }

  const blendedVibes = [...weights.entries()]
    .map(([tag, weight]) => ({
      tag,
      weight: Math.max(1, Math.round(weight)),
    }))
    .sort((a, b) => b.weight - a.weight || a.tag.localeCompare(b.tag))
    .slice(0, Math.max(1, Math.min(16, Math.round(limit))));

  return {
    blendedVibes,
    dominantVibe: blendedVibes[0]?.tag ?? null,
  };
}

export function hasMoodBoardVibeBlend(
  result: MoodBoardVibeBlendResult
): boolean {
  return result.blendedVibes.length > 0;
}
