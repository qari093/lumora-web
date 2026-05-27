import { scoreScene } from "./sceneScoring";
import type { SceneSignals } from "./sceneTypes";

export type ClipQualityInput = SceneSignals & {
  id: string;
  title?: string;
  source?: string;
};

export function validateClipSceneQuality(input: ClipQualityInput) {
  const decision = scoreScene(input);

  return {
    ...decision,
    id: input.id,
  };
}

export function filterHighQualityScenes<T extends ClipQualityInput>(items: T[]): T[] {
  return items.filter((item) => validateClipSceneQuality(item).ok);
}
