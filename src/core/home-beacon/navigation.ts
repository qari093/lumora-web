import { getHomeBeaconPortal, type HomeBeaconPortalId } from "./portalRegistry";

export type HomeBeaconNavigationDecision = {
  ok: boolean;
  href: string | null;
  portalId: HomeBeaconPortalId | null;
  reason: string;
};

export function createHomeBeaconNavigationDecision(portalId: HomeBeaconPortalId): HomeBeaconNavigationDecision {
  const portal = getHomeBeaconPortal(portalId);
  if (!portal) {
    return { ok: false, href: null, portalId: null, reason: "portal_not_found" };
  }

  return {
    ok: true,
    href: portal.href,
    portalId,
    reason: "portal_ready",
  };
}

export function createHomeBeaconReturnDecision(): HomeBeaconNavigationDecision {
  return {
    ok: true,
    href: "/",
    portalId: null,
    reason: "return_home",
  };
}
