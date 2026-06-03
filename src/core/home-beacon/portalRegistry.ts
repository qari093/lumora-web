export type HomeBeaconPortalId =
  | "fyp"
  | "lumaspace"
  | "live"
  | "gmar"
  | "nexa"
  | "zendoro"
  | "movies"
  | "music"
  | "creator"
  | "wallet"
  | "notifications"
  | "settings";

export type HomeBeaconPortal = {
  id: HomeBeaconPortalId;
  label: string;
  href: string;
  color: string;
  priority: number;
};

export const HOME_BEACON_PORTALS: HomeBeaconPortal[] = [
  { id: "fyp", label: "FYP", href: "/fyp", color: "blue", priority: 1 },
  { id: "lumaspace", label: "LumaSpace", href: "/lumaspace", color: "purple", priority: 2 },
  { id: "live", label: "Live", href: "/live", color: "red", priority: 3 },
  { id: "gmar", label: "GMAR", href: "/gmar", color: "orange", priority: 4 },
  { id: "nexa", label: "NEXA", href: "/nexa", color: "green", priority: 5 },
  { id: "zendoro", label: "Zendoro", href: "/zendoro", color: "gold", priority: 6 },
  { id: "movies", label: "Movies", href: "/movies", color: "silver", priority: 7 },
  { id: "music", label: "Music", href: "/music", color: "cyan", priority: 8 },
  { id: "creator", label: "Creator", href: "/creator", color: "pink", priority: 9 },
  { id: "wallet", label: "Wallet", href: "/wallet", color: "emerald", priority: 10 },
  { id: "notifications", label: "Glimmers", href: "/notifications", color: "amber", priority: 11 },
  { id: "settings", label: "Settings", href: "/settings", color: "slate", priority: 12 },
];

export function getHomeBeaconPortals(): HomeBeaconPortal[] {
  return [...HOME_BEACON_PORTALS].sort((a, b) => a.priority - b.priority);
}

export function getHomeBeaconPortal(id: HomeBeaconPortalId): HomeBeaconPortal | undefined {
  return HOME_BEACON_PORTALS.find((portal) => portal.id === id);
}
