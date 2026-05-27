export type SeedDashboardZone = {
  id: "central_canvas" | "personal_halo" | "social_orbit";
  widthPercent: number;
  launchRole: string;
  required: true;
};

export const seedDashboardZones: SeedDashboardZone[] = [
  {
    id: "central_canvas",
    widthPercent: 60,
    launchRole: "sky_constellation_echoes",
    required: true,
  },
  {
    id: "personal_halo",
    widthPercent: 20,
    launchRole: "identity_memory_spark",
    required: true,
  },
  {
    id: "social_orbit",
    widthPercent: 20,
    launchRole: "echo_gift_presence",
    required: true,
  },
];

export function seedDashboardLayoutHealthy(): boolean {
  return (
    seedDashboardZones.length === 3 &&
    seedDashboardZones.every((zone) => zone.required) &&
    seedDashboardZones.reduce((sum, zone) => sum + zone.widthPercent, 0) === 100
  );
}
