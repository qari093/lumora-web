import { civilizationSeedReady } from "../seed/civilizationSeed";
import { seedTrackerHealthy } from "./threeMonthSeedTracker";

export type GmarSeedSeal = {
  system: "GMAR Civilization Seed";
  status: "PASS" | "FAILED";
  oneGameOnly: true;
  dashboardReady: boolean;
  trackerReady: boolean;
};

export function createGmarSeedSeal(): GmarSeedSeal {
  const dashboardReady = civilizationSeedReady();
  const trackerReady = seedTrackerHealthy();

  return {
    system: "GMAR Civilization Seed",
    status: dashboardReady && trackerReady ? "PASS" : "FAILED",
    oneGameOnly: true,
    dashboardReady,
    trackerReady,
  };
}
