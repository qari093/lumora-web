export type LiveBridgeTarget = "fyp" | "lumaspace" | "gmar" | "music";

export type LiveBridge = {
  target: LiveBridgeTarget;
  active: boolean;
  route: string;
};

export function getLiveBridges(): LiveBridge[] {
  return [
    { target: "fyp", active: true, route: "/fyp" },
    { target: "lumaspace", active: true, route: "/lumaspace" },
    { target: "gmar", active: true, route: "/gmar" },
    { target: "music", active: true, route: "/music" },
  ];
}

export function hasRequiredLiveBridges(): boolean {
  const active = new Set(getLiveBridges().filter((bridge) => bridge.active).map((bridge) => bridge.target));
  return ["fyp", "lumaspace", "gmar", "music"].every((target) => active.has(target as LiveBridgeTarget));
}
