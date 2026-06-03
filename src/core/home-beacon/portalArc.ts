import { getHomeBeaconPortals, type HomeBeaconPortal } from "./portalRegistry";

export type HomeBeaconPortalArcItem = HomeBeaconPortal & {
  angleDeg: number;
  x: number;
  y: number;
};

export function createHomeBeaconPortalArc(radius = 118): HomeBeaconPortalArcItem[] {
  const portals = getHomeBeaconPortals();
  const start = 210;
  const end = -30;
  const step = portals.length <= 1 ? 0 : (end - start) / (portals.length - 1);

  return portals.map((portal, index) => {
    const angleDeg = start + step * index;
    const rad = (angleDeg * Math.PI) / 180;
    return {
      ...portal,
      angleDeg,
      x: Number((Math.cos(rad) * radius).toFixed(2)),
      y: Number((Math.sin(rad) * radius).toFixed(2)),
    };
  });
}
