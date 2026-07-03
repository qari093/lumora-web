import type { UniversalShareObject } from "../foundation/types";
import type { AtmosphereShare, EchoShare, LivingMemoryMood } from "./types";

export function createEchoShare(
  share: UniversalShareObject,
  voiceDurationSeconds: number,
  transcriptHint = "A personal echo is attached.",
): EchoShare {
  return {
    id: `echo_share_${share.id}`,
    shareId: share.id,
    voiceDurationSeconds: Math.max(1, Math.min(15, Math.round(voiceDurationSeconds))),
    transcriptHint,
  };
}

export function createAtmosphereShare(
  share: UniversalShareObject,
  mood: LivingMemoryMood,
  atmosphere: string,
): AtmosphereShare {
  return {
    id: `atmosphere_share_${share.id}`,
    shareId: share.id,
    mood,
    atmosphere,
    durationMs: 10000,
  };
}
