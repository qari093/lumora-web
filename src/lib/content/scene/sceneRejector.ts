import type { SceneSignals } from "./sceneTypes";

export function rejectIntroOrCreditsScene(scene: SceneSignals): string[] {
  const reasons: string[] = [];

  if (scene.hasIntroText) reasons.push("intro_text_detected");
  if (scene.hasCreditsText) reasons.push("credits_text_detected");
  if (scene.hasBlackFrames) reasons.push("black_frames_detected");

  return reasons;
}

export function isLikelyBadOpeningScene(scene: SceneSignals): boolean {
  return rejectIntroOrCreditsScene(scene).length > 0;
}
