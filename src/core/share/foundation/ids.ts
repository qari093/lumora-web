export function createShareId(seed: string, now: string = new Date().toISOString()): string {
  const normalized = `${seed}:${now}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:._-]/g, "-");

  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0;
  }

  return `uso_${hash.toString(36)}_${Date.parse(now).toString(36)}`;
}
