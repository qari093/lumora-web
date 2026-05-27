export type DashboardZone =
  | "atmosphere_bar"
  | "living_seed"
  | "whisper_panel"
  | "constellation_river"
  | "quiet_impact"
  | "breath_button";

export type SeedState = "sleeping" | "growing" | "blooming";

export type ResonanceLedgerState =
  | "quiet_lake"
  | "blooming_current"
  | "glowing_river"
  | "resonant_tide";

export type CreatorDashboardStage = "starter" | "resonance" | "mythic";

export interface AtmosphereBarModel {
  visible: boolean;
  text: string;
  intensity: "none" | "soft" | "active";
  gradient: string;
}

export interface LivingSeedModel {
  state: SeedState;
  label: string;
  log: string;
}

export interface WhisperModel {
  id: string;
  text: string;
  videoId?: string;
  timestampSeconds?: number;
  priority: number;
}

export interface ConstellationOrbModel {
  creatorId: string;
  displayName: string;
  isSelf: boolean;
  pulse: boolean;
  constellation: string;
}

export interface QuietImpactModel {
  silentReturnsText: string;
  quietGiftsText: string;
  legacyEchoText: string;
  resonanceState: ResonanceLedgerState;
  horizonProgress: number;
}

export interface BreathingDashboardModel {
  stage: CreatorDashboardStage;
  zones: DashboardZone[];
  atmosphere: AtmosphereBarModel;
  seed: LivingSeedModel;
  whisper: WhisperModel | null;
  whisperArchive: WhisperModel[];
  constellationOrbs: ConstellationOrbModel[];
  quietImpact: QuietImpactModel;
  creativeIntensityEnabled: boolean;
}
