import { gmarDesignTokensHealthy } from "../dashboard-polish/designTokens";
import { gmarLaunchSurfaceHealthy } from "../dashboard-polish/launchSurface";
import { gmarPolishChecklistHealthy } from "../dashboard-polish/polishChecklist";
import { gmarPackRegistryHealthy } from "./packStatus";

export type GmarFinalSeal = {
  system: "GMAR Civilization Seed";
  status: "PASS" | "FAILED";
  dashboardPolished: boolean;
  launchSurfaceReady: boolean;
  packRegistryReady: boolean;
  productionDoctrine: "ethical_memory_civilization";
};

export function createGmarFinalSeal(): GmarFinalSeal {
  const dashboardPolished = gmarDesignTokensHealthy() && gmarPolishChecklistHealthy();
  const launchSurfaceReady = gmarLaunchSurfaceHealthy();
  const packRegistryReady = gmarPackRegistryHealthy();

  return {
    system: "GMAR Civilization Seed",
    status: dashboardPolished && launchSurfaceReady && packRegistryReady ? "PASS" : "FAILED",
    dashboardPolished,
    launchSurfaceReady,
    packRegistryReady,
    productionDoctrine: "ethical_memory_civilization",
  };
}
