import type {
  WeeklyReflection
} from "../conductor/types";

export type ReflectionShareCard = {
  cardId: string;
  headline: string;
  atmosphereSummary: string;
  viralReady: boolean;
};

export function createReflectionShareCard(
  reflection: WeeklyReflection
): ReflectionShareCard {
  return {
    cardId: `share_${reflection.reflectionId}`,
    headline: `Your week moved through ${reflection.dominantMode}`,
    atmosphereSummary:
      `${reflection.atmosphereHours} hours inside ${reflection.emotionalSignature}`,
    viralReady: true
  };
}
