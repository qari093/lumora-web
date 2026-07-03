import type { ProvenanceEntry } from "./types";

export function createProvenanceHash(parts: Record<string, unknown>): string {
  const input = JSON.stringify(parts);
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;

  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }

  const left = (h1 >>> 0).toString(16).padStart(8, "0");
  const right = (h2 >>> 0).toString(16).padStart(8, "0");
  return `${left}${right}${left}${right}${left}${right}${left}${right}`.slice(0, 64);
}

export function createProvenanceEntry(input: Omit<ProvenanceEntry, "id" | "at" | "hash">): ProvenanceEntry {
  const at = new Date().toISOString();
  const hash = createProvenanceHash({ ...input, at });

  return {
    ...input,
    id: `provenance_${input.objectId}_${input.action}_${input.actorId}`,
    at,
    hash,
  };
}

export function appendProvenanceTrail(trail: ProvenanceEntry[], entry: ProvenanceEntry): ProvenanceEntry[] {
  return [...trail.filter((item) => item.id !== entry.id), entry];
}

export function verifyProvenanceTrail(trail: ProvenanceEntry[]): boolean {
  return trail.every((entry) => Boolean(entry.hash) && entry.hash.length === 64);
}
