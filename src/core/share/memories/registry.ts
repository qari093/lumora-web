import type { UniversalShareObject } from "../foundation/types";
import { createAtmosphereShare, createEchoShare } from "./echo";
import { createMemoryStar } from "./star";
import type { LivingMemoryRecord } from "./types";

function readObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function collectMetadata(value: unknown, out: Record<string, unknown> = {}): Record<string, unknown> {
  const obj = readObject(value);

  for (const [key, nestedValue] of Object.entries(obj)) {
    if (out[key] === undefined) out[key] = nestedValue;
    if (nestedValue && typeof nestedValue === "object" && !Array.isArray(nestedValue)) {
      collectMetadata(nestedValue, out);
    }
  }

  return out;
}

function hasEchoIntent(metadata: Record<string, unknown>, share: UniversalShareObject): boolean {
  return (
    metadata.echo === true ||
    metadata.echoShare === true ||
    metadata.kind === "echo" ||
    String(metadata.transformation ?? "").toLowerCase().includes("echo") ||
    String(share.title ?? "").toLowerCase().includes("echo") ||
    Number.isFinite(Number(metadata.echoDurationSeconds)) ||
    Number.isFinite(Number(metadata.voiceDurationSeconds))
  );
}

export function createLivingMemoryRecord(share: UniversalShareObject): LivingMemoryRecord {
  const star = createMemoryStar(share);
  const metadata = collectMetadata(share);
  const echoDuration = Number(metadata.echoDurationSeconds ?? metadata.voiceDurationSeconds ?? 12);
  const echoEnabled = hasEchoIntent(metadata, share);

  return {
    id: `living_memory_${share.id}`,
    sourceShare: share,
    kind: "memory_star",
    visibility: "shared",
    star,
    echo: echoEnabled ? createEchoShare(share, echoDuration) : undefined,
    atmosphere: createAtmosphereShare(share, star.mood, star.atmosphere),
    timeline: [
      {
        id: `timeline_${share.id}_created`,
        at: new Date().toISOString(),
        kind: "memory_star",
        title: share.title,
        weight: star.brightness,
      },
    ],
  };
}

export function createPassiveDiscoveryWhisper(record: LivingMemoryRecord): string {
  return `Something new has drifted into your orbit: ${record.star.title}`;
}

export function createSharedSilenceSignal(record: LivingMemoryRecord): string {
  return "A quiet glow marks that someone shared this moment before you.";
}
