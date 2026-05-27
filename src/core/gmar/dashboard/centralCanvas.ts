export type CentralCanvasLaunchState = {
  activeGame: "zen-flow";
  foundingEchoCount: 5;
  dormantConstellationsVisible: true;
  mirrorHourReady: true;
};

export function createCentralCanvasLaunchState(): CentralCanvasLaunchState {
  return {
    activeGame: "zen-flow",
    foundingEchoCount: 5,
    dormantConstellationsVisible: true,
    mirrorHourReady: true,
  };
}
