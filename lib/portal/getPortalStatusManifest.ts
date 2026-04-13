import { getActivePortals } from "@/lib/portal/getActivePortals";

const PATHS: Record<string, string> = {
  fyp: "/fyp",
  gmar: "/gmar",
  nexa: "/nexa",
  cineverse: "/cineverse",
  live: "/live",
  wallet: "/wallet",
  profile: "/profile",
};

export function getPortalStatusManifest() {
  return getActivePortals().map((portal) => ({
    key: portal.key,
    enabled: portal.enabled,
    path: PATHS[portal.key] ?? `/${portal.key}`,
    status: "active" as const,
  }));
}
