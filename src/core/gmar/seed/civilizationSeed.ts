import { createCentralCanvasLaunchState } from "../dashboard/centralCanvas";
import { createPersonalHaloLaunchState } from "../dashboard/personalHalo";
import { createSocialOrbitLaunchState } from "../dashboard/socialOrbit";
import { seedDashboardLayoutHealthy } from "../dashboard/seedLayout";

export type CivilizationSeedReadiness = {
  onlyLaunchGame: "zen-flow";
  centralCanvasReady: boolean;
  personalHaloReady: boolean;
  socialOrbitReady: boolean;
  layoutReady: boolean;
  overbuildProtected: boolean;
};

export function createCivilizationSeedReadiness(): CivilizationSeedReadiness {
  const central = createCentralCanvasLaunchState();
  const halo = createPersonalHaloLaunchState();
  const orbit = createSocialOrbitLaunchState();

  return {
    onlyLaunchGame: central.activeGame,
    centralCanvasReady:
      central.foundingEchoCount === 5 &&
      central.dormantConstellationsVisible &&
      central.mirrorHourReady,
    personalHaloReady:
      halo.firstLightVisible &&
      halo.dailySparkVisible &&
      halo.solaceCoinSlot &&
      halo.keeperMoteSlot,
    socialOrbitReady:
      orbit.echoGiftVisible &&
      orbit.onlineLightsVisible &&
      orbit.squadPlaceholderVisible &&
      !orbit.liveRoomsEnabled,
    layoutReady: seedDashboardLayoutHealthy(),
    overbuildProtected: true,
  };
}

export function civilizationSeedReady(): boolean {
  const readiness = createCivilizationSeedReadiness();

  return (
    readiness.onlyLaunchGame === "zen-flow" &&
    readiness.centralCanvasReady &&
    readiness.personalHaloReady &&
    readiness.socialOrbitReady &&
    readiness.layoutReady &&
    readiness.overbuildProtected
  );
}
