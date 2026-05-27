export function mergeCircles(
  a: string[],
  b: string[],
  maxSize: number
): string[] {
  const merged = Array.from(new Set([...a, ...b]));
  return merged.slice(0, maxSize);
}
