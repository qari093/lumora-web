export const DASHBOARD_ZONES = [
  "atmosphere_bar",
  "living_seed",
  "whisper_panel",
  "constellation_river",
  "quiet_impact_corner"
] as const;

export function validateDashboardZones(zones: string[]): boolean {
  return DASHBOARD_ZONES.every((zone) => zones.includes(zone));
}
