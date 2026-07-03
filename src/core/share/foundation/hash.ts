export function createStableHash(value: unknown): string {
  const raw = JSON.stringify(value, Object.keys(value as object).sort());
  let hash = 2166136261;

  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `sha_${(hash >>> 0).toString(36)}`;
}
