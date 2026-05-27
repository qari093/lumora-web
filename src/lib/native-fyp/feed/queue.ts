import type { NativeFypVideo } from "../schema";

export function ensureQueueSize(items: NativeFypVideo[], size = 20): NativeFypVideo[] {
  if (items.length >= size) return items.slice(0, size);

  const out = [...items];
  let i = 0;
  while (out.length < size) {
    out.push(items[i % items.length]);
    i++;
  }
  return out;
}
