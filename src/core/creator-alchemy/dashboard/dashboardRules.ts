import type { CreatorDashboardStage, DashboardZone } from "./types";

const STARTER_ZONES: DashboardZone[] = [
  "atmosphere_bar",
  "living_seed",
  "whisper_panel",
  "quiet_impact",
  "breath_button"
];

const RESONANCE_ZONES: DashboardZone[] = [
  ...STARTER_ZONES,
  "constellation_river"
];

const MYTHIC_ZONES: DashboardZone[] = RESONANCE_ZONES;

export function getDashboardZones(stage: CreatorDashboardStage): DashboardZone[] {
  if (stage === "starter") return STARTER_ZONES;
  if (stage === "resonance") return RESONANCE_ZONES;
  return MYTHIC_ZONES;
}

export function normalizeHorizonProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function shouldShowAtmosphere(daySignalStrength: number, recentlyShownCount: number): boolean {
  if (!Number.isFinite(daySignalStrength)) return false;
  if (recentlyShownCount >= 4) return false;
  return daySignalStrength >= 0.42;
}

export function getAllowedWhisperCount(creativeIntensityEnabled: boolean): number {
  return creativeIntensityEnabled ? 3 : 1;
}

export function keepRecentWhispers<T>(items: readonly T[], max = 4): T[] {
  return [...items].slice(0, Math.max(0, max));
}
