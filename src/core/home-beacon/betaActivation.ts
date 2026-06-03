export type HomeBeaconBetaActivation = {
  homeBeaconEnabled: boolean;
  portalArcEnabled: boolean;
  dashboardEnabled: boolean;
  gravityBridgeEnabled: boolean;
  interactionBridgeEnabled: boolean;
  notificationLayerEnabled: boolean;
  economyLayerEnabled: boolean;
  privateBetaReady: boolean;
};

export function getHomeBeaconBetaActivation(): HomeBeaconBetaActivation {
  return {
    homeBeaconEnabled: true,
    portalArcEnabled: true,
    dashboardEnabled: true,
    gravityBridgeEnabled: true,
    interactionBridgeEnabled: true,
    notificationLayerEnabled: true,
    economyLayerEnabled: true,
    privateBetaReady: true,
  };
}
