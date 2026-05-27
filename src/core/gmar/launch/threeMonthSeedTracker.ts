export type SeedMonth = {
  month: 1 | 2 | 3;
  name: string;
  outcomes: string[];
};

export const threeMonthSeedTracker: SeedMonth[] = [
  {
    month: 1,
    name: "Sky & Memory",
    outcomes: ["Central Canvas alive", "Founding Echoes visible", "Zen Flow active"],
  },
  {
    month: 2,
    name: "Breath & Ritual",
    outcomes: ["First Echo Rite live", "Mirror Hour live", "Daily Spark live"],
  },
  {
    month: 3,
    name: "Arrival & Bond",
    outcomes: ["Echo Gift live", "Solace Coin live", "Keeper of the Light live"],
  },
];

export function seedTrackerHealthy(): boolean {
  return (
    threeMonthSeedTracker.length === 3 &&
    threeMonthSeedTracker.every((month) => month.outcomes.length >= 3)
  );
}
