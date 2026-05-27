import type { NativeFypVideo } from "../schema";

export function dedupeFeed(items: NativeFypVideo[]): NativeFypVideo[] {
  const seen = new Set<string>();
  const out: NativeFypVideo[] = [];

  for (const v of items) {
    if (!seen.has(v.id)) {
      seen.add(v.id);
      out.push(v);
    }
  }

  return out;
}
