export type GmarLaunchSurface = {
  centralCanvas: true;
  personalHalo: true;
  socialOrbit: true;
  activeGame: "zen-flow";
  dormantConstellationsVisible: true;
  foundingEchoes: 5;
  firstLight: true;
  dailySpark: true;
  mirrorHour: true;
  echoGift: true;
};

export function createGmarLaunchSurface(): GmarLaunchSurface {
  return {
    centralCanvas: true,
    personalHalo: true,
    socialOrbit: true,
    activeGame: "zen-flow",
    dormantConstellationsVisible: true,
    foundingEchoes: 5,
    firstLight: true,
    dailySpark: true,
    mirrorHour: true,
    echoGift: true,
  };
}

export function gmarLaunchSurfaceHealthy(surface = createGmarLaunchSurface()): boolean {
  return (
    surface.centralCanvas &&
    surface.personalHalo &&
    surface.socialOrbit &&
    surface.activeGame === "zen-flow" &&
    surface.dormantConstellationsVisible &&
    surface.foundingEchoes === 5 &&
    surface.firstLight &&
    surface.dailySpark &&
    surface.mirrorHour &&
    surface.echoGift
  );
}
