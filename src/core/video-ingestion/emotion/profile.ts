import type { EmotionalFingerprint, EmotionalFingerprintInput, EmotionalLane } from "./types";

function clamp(value: number) {
  return Number(Math.max(0, Math.min(1, value)).toFixed(4));
}

function dominant(scores: Record<EmotionalLane, number>): EmotionalLane {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as EmotionalLane;
}

export function createEmotionalFingerprint(input: EmotionalFingerprintInput): EmotionalFingerprint {
  const metadata = input.asset.metadata ?? {};
  const motionIntensity = clamp(input.motionIntensity ?? Number(metadata.motionIntensity ?? 0.28));
  const contrastIntensity = clamp(input.contrastIntensity ?? Number(metadata.contrastIntensity ?? 0.32));
  const audioEnergy = clamp(input.audioEnergy ?? Number(metadata.audioEnergy ?? 0.35));
  const silenceRatio = clamp(input.silenceRatio ?? Number(metadata.silenceRatio ?? 0.42));
  const colorTemperature = input.colorTemperature ?? (metadata.colorTemperature as EmotionalFingerprint["colorTemperature"]) ?? "cool";

  const serenity = clamp((1 - motionIntensity) * 0.35 + (1 - contrastIntensity) * 0.25 + silenceRatio * 0.25 + (1 - audioEnergy) * 0.15);
  const wonder = clamp(Number(metadata.wonder ?? 0.55) * 0.45 + (colorTemperature === "cool" ? 0.22 : 0.12) + contrastIntensity * 0.18 + silenceRatio * 0.15);
  const spectacle = clamp(motionIntensity * 0.42 + contrastIntensity * 0.28 + audioEnergy * 0.3);
  const memory = clamp(Number(metadata.memory ?? 0.48) * 0.5 + serenity * 0.25 + silenceRatio * 0.25);
  const learning = clamp(Number(metadata.learning ?? 0.42) * 0.6 + (input.asset.tags.includes("learn") ? 0.25 : 0.05) + silenceRatio * 0.15);
  const connection = clamp(Number(metadata.connection ?? 0.38) * 0.55 + (input.asset.tags.includes("community") ? 0.25 : 0.05) + serenity * 0.2);

  const scores: Record<EmotionalLane, number> = {
    serenity,
    wonder,
    spectacle,
    memory,
    learning,
    connection,
  };

  return {
    assetId: input.asset.id,
    providerId: input.asset.providerId,
    dominantLane: dominant(scores),
    serenity,
    wonder,
    spectacle,
    memory,
    learning,
    connection,
    motionIntensity,
    contrastIntensity,
    audioEnergy,
    silenceRatio,
    colorTemperature,
    safeForCalmMode: serenity >= 0.68 && spectacle <= 0.42,
  };
}

export function attachEmotionalFingerprint<T extends { metadata: Record<string, unknown> }>(
  asset: T,
  fingerprint: EmotionalFingerprint,
): T {
  return {
    ...asset,
    metadata: {
      ...asset.metadata,
      emotionalFingerprint: fingerprint,
      serenityScore: fingerprint.serenity,
      wonderScore: fingerprint.wonder,
      spectacleScore: fingerprint.spectacle,
      dominantEmotionalLane: fingerprint.dominantLane,
      safeForCalmMode: fingerprint.safeForCalmMode,
    },
  };
}
