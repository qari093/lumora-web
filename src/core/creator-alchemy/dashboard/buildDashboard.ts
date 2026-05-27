import { validateEmotionalDensity } from "../foundation";
import {
  getAllowedWhisperCount,
  getDashboardZones,
  keepRecentWhispers,
  normalizeHorizonProgress,
  shouldShowAtmosphere
} from "./dashboardRules";
import type {
  AtmosphereBarModel,
  BreathingDashboardModel,
  ConstellationOrbModel,
  CreatorDashboardStage,
  LivingSeedModel,
  QuietImpactModel,
  WhisperModel
} from "./types";

export interface BuildDashboardInput {
  stage: CreatorDashboardStage;
  daySignalStrength: number;
  recentlyShownAtmospheres: number;
  seed: LivingSeedModel;
  whispers: WhisperModel[];
  orbs: ConstellationOrbModel[];
  quietImpact: QuietImpactModel;
  creativeIntensityEnabled?: boolean;
}

export function buildBreathingDashboard(input: BuildDashboardInput): BreathingDashboardModel {
  const creativeIntensityEnabled = input.creativeIntensityEnabled === true;
  const allowedWhispers = getAllowedWhisperCount(creativeIntensityEnabled);
  const whisperArchive = keepRecentWhispers(
    [...input.whispers].sort((a, b) => b.priority - a.priority),
    4
  );

  const activeWhisper = whisperArchive[0] ?? null;

  const visibleAtmosphere = shouldShowAtmosphere(input.daySignalStrength, input.recentlyShownAtmospheres);
  const atmosphere: AtmosphereBarModel = {
    visible: visibleAtmosphere,
    text: visibleAtmosphere
      ? "Tonight feels reflective — your recent work caused unusually long lingering."
      : "",
    intensity: visibleAtmosphere ? "soft" : "none",
    gradient: visibleAtmosphere
      ? "linear-gradient(135deg, rgba(122,92,255,0.18), rgba(35,211,255,0.12))"
      : "transparent"
  };

  const density = validateEmotionalDensity({
    majorInsights: Math.min(input.whispers.length, allowedWhispers),
    atmospheres: atmosphere.visible ? 1 : 0,
    symbolicMoments: 1,
    creativeIntensity: creativeIntensityEnabled
  });

  if (!density.ok) {
    throw new Error(`Dashboard emotional density violation: ${density.reason}`);
  }

  return {
    stage: input.stage,
    zones: getDashboardZones(input.stage),
    atmosphere,
    seed: input.seed,
    whisper: activeWhisper,
    whisperArchive,
    constellationOrbs: input.stage === "starter" ? [] : input.orbs,
    quietImpact: {
      ...input.quietImpact,
      horizonProgress: normalizeHorizonProgress(input.quietImpact.horizonProgress)
    },
    creativeIntensityEnabled
  };
}
