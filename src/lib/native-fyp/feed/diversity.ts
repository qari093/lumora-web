import type { NativeFypVideo } from "../schema";

export function enforceDiversity(items: NativeFypVideo[]): NativeFypVideo[] {
  const bucket: Record<string, number> = {};
  const maxPerSource = 5;

  const primary: NativeFypVideo[] = [];
  const overflow: NativeFypVideo[] = [];

  for (const v of items) {
    const key = v.sourceType;
    bucket[key] = bucket[key] || 0;

    if (bucket[key] < maxPerSource) {
      primary.push(v);
      bucket[key]++;
    } else {
      overflow.push(v);
    }
  }

  // CRITICAL FIX:
  // fill remaining slots from overflow to ensure feed always reaches 20
  const merged = [...primary, ...overflow];

  return merged;
}
