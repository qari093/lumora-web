import type {
  GutCheckResult
} from "../gutcheck/types";

export type ShareCard = {
  title: string;
  subtitle: string;
  shareReady: boolean;
};

export function createGutCheckShareCard(
  result: GutCheckResult
): ShareCard {
  return {
    title:
      `Gut Check: ${result.dominantMode}`,
    subtitle:
      `Adrenaline Index ${result.adrenalineIndex}`,
    shareReady: result.shareCardReady
  };
}
