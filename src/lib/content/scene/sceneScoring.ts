import type { SceneSignals, SceneDecision } from "./sceneTypes";
import { rejectIntroOrCreditsScene } from "./sceneRejector";

export function scoreScene(scene: SceneSignals): SceneDecision {
  const reasons = rejectIntroOrCreditsScene(scene);
  let score = 50;

  if (scene.hasHumanPresence) score += 20;
  if (scene.hasNarrativeAction) score += 20;
  if (scene.hasStrongMotion) score += 10;

  if (typeof scene.audioEnergyDb === "number") {
    if (scene.audioEnergyDb > -35) score += 15;
    if (scene.audioEnergyDb < -50) {
      score -= 30;
      reasons.push("weak_audio_energy");
    }
  }

  const duration = Number(scene.durationSeconds || 0);
  if (duration && (duration < 6 || duration > 180)) {
    score -= 20;
    reasons.push("bad_scene_duration");
  }

  if (reasons.length) score -= 45;

  return {
    ok: score >= 60 && reasons.length === 0,
    score,
    reasons,
  };
}
