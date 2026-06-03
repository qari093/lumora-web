export type HomeBeaconGravityBridge = {
  integrated: boolean;
  longPressActivatesGravity: boolean;
  emergencyReturnEnabled: boolean;
  navigationHijackAllowed: false;
};

export function getHomeBeaconGravityBridge(): HomeBeaconGravityBridge {
  return {
    integrated: true,
    longPressActivatesGravity: true,
    emergencyReturnEnabled: true,
    navigationHijackAllowed: false,
  };
}
