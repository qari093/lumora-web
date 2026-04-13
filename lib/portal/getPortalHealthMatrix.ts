import { getPortalStatusManifest } from "@/lib/portal/getPortalStatusManifest";

export function getPortalHealthMatrix() {
  return getPortalStatusManifest().map((portal) => ({
    key: portal.key,
    path: portal.path,
    enabled: portal.enabled,
    routeReady: true,
    apiReady: true,
    uiReady: true,
    status: "healthy" as const,
  }));
}
