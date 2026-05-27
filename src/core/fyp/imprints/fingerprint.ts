import type { EchoImprint } from "./types";

export type EchoFingerprint = {
  contentId: string;
  dominantEmotion: string;
  averageIntensity: number;
  colorSignature: string;
  imprintDensity: number;
};

const EMOTION_COLORS: Record<string, string> = {
  moved: "#7dd3fc",
  charged: "#fb7185",
  haunted: "#a78bfa",
  comforted: "#86efac",
  obsessed: "#facc15",
  focused: "#cbd5e1",
  weightless: "#67e8f9"
};

export function generateEchoFingerprint(
  imprints: EchoImprint[]
): EchoFingerprint {
  if (imprints.length === 0) {
    throw new Error("Fingerprint requires imprints.");
  }

  const counts = new Map<string, number>();

  for (const imprint of imprints) {
    counts.set(
      imprint.emotion,
      (counts.get(imprint.emotion) ?? 0) + 1
    );
  }

  const dominantEmotion =
    [...counts.entries()]
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "moved";

  const averageIntensity =
    imprints.reduce(
      (sum, imprint) => sum + imprint.intensity,
      0
    ) / imprints.length;

  return {
    contentId: imprints[0].contentId,
    dominantEmotion,
    averageIntensity: Number(
      averageIntensity.toFixed(2)
    ),
    colorSignature:
      EMOTION_COLORS[dominantEmotion] ?? "#ffffff",
    imprintDensity: imprints.length
  };
}
