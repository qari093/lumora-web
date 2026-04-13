export type IdentityVibeTagSignalInput = {
  watchedMoodTags: string[];
  reactedMoodTags: string[];
  savedMoodTags: string[];
  explicitVibeTags?: string[];
};

export type IdentityVibeTag = {
  tag: string;
  weight: number;
};

export type IdentityVibeTagMapResult = {
  vibeTags: IdentityVibeTag[];
};

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

function accumulate(
  target: Map<string, number>,
  tags: string[],
  weight: number
): void {
  for (const rawTag of tags) {
    const tag = normalizeTag(rawTag);
    if (!tag) continue;
    target.set(tag, (target.get(tag) ?? 0) + weight);
  }
}

export function mapIdentityVibeTags(
  input: IdentityVibeTagSignalInput
): IdentityVibeTagMapResult {
  const weights = new Map<string, number>();

  accumulate(weights, input.watchedMoodTags, 1);
  accumulate(weights, input.reactedMoodTags, 2);
  accumulate(weights, input.savedMoodTags, 3);
  accumulate(weights, input.explicitVibeTags ?? [], 4);

  const vibeTags = [...weights.entries()]
    .map(([tag, weight]) => ({
      tag,
      weight: Math.max(1, Math.round(weight)),
    }))
    .sort((a, b) => b.weight - a.weight || a.tag.localeCompare(b.tag))
    .slice(0, 16);

  return { vibeTags };
}

export function hasIdentityVibeTags(
  result: IdentityVibeTagMapResult
): boolean {
  return result.vibeTags.length > 0;
}
