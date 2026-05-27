export function dedupeManifest(items: any[]) {
  const seen = new Set<string>();
  const out: any[] = [];

  for (const item of items) {
    const key = item.source + ":" + (item.sourceId || item.mp4Url);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}
