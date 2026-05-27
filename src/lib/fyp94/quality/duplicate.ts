export type Fyp94DuplicateInput = {
  source?: string;
  sourceId?: string | number;
  pexelsId?: string | number;
  mp4Url?: string;
  localUrl?: string;
};

export function createFyp94DuplicateKey(item: Fyp94DuplicateInput): string {
  const sourceId = item.sourceId ?? item.pexelsId ?? "";
  if (item.source && sourceId) return `${item.source}:${sourceId}`;
  if (item.mp4Url) return `url:${item.mp4Url}`;
  if (item.localUrl) return `local:${item.localUrl}`;
  return "unknown";
}

export function dedupeFyp94Manifest<T extends Fyp94DuplicateInput>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];

  for (const item of items) {
    const key = createFyp94DuplicateKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}
