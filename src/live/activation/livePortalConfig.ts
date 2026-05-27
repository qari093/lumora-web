export const LIVE_PORTAL_ID = "live" as const;
export const LIVE_PORTAL_ROUTE = "/live" as const;

export type LivePortalConfig = {
  id: typeof LIVE_PORTAL_ID;
  name: "Live";
  route: typeof LIVE_PORTAL_ROUTE;
  enabled: boolean;
  status: "runtime_visible";
  description: string;
};

export function isLivePortalEnabled(): boolean {
  return process.env.LIVE_PORTAL_ENABLED !== "0";
}

export function getLivePortalConfig(): LivePortalConfig {
  return {
    id: LIVE_PORTAL_ID,
    name: "Live",
    route: LIVE_PORTAL_ROUTE,
    enabled: isLivePortalEnabled(),
    status: "runtime_visible",
    description: "Lumora Live Ω∞ synchronized human coexistence portal",
  };
}
