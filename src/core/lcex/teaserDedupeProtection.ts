import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";

export type TeaserDedupeCandidate = {
  id: string;
  metadata: ExtractedTeaserMetadata;
};

export function buildTeaserDedupeKey(
  metadata: ExtractedTeaserMetadata
): string {
  const title = metadata.title.trim().toLowerCase();
  const source = metadata.sourceName.trim().toLowerCase();
  const category = metadata.category.trim().toLowerCase();
  const region = metadata.region.trim().toLowerCase();
  const language = metadata.language.trim().toLowerCase();

  return [title, source, category, region, language].join("::");
}

export function dedupeTeaserCandidates(
  candidates: TeaserDedupeCandidate[]
): TeaserDedupeCandidate[] {
  const seen = new Set<string>();
  const output: TeaserDedupeCandidate[] = [];

  for (const candidate of candidates) {
    const key = buildTeaserDedupeKey(candidate.metadata);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(candidate);
  }

  return output;
}

export function isDuplicateTeaserCandidate(
  candidate: TeaserDedupeCandidate,
  existing: TeaserDedupeCandidate[]
): boolean {
  const needle = buildTeaserDedupeKey(candidate.metadata);
  return existing.some(
    (item) => buildTeaserDedupeKey(item.metadata) === needle
  );
}
