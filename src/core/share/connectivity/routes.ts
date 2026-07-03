import type { ConnectivityChannel, ConnectivityRoute } from "./types";

export function createConnectivityRoute(params: {
  channel: ConnectivityChannel;
  destination: string;
  priority?: number;
  healthy?: boolean;
}): ConnectivityRoute {
  return {
    id: `connectivity_route_${params.channel}_${params.destination.replace(/[^a-z0-9]+/gi, "_")}`,
    channel: params.channel,
    destination: params.destination,
    priority: params.priority ?? 50,
    healthy: params.healthy ?? true,
  };
}

export function selectBestConnectivityRoute(routes: ConnectivityRoute[]): ConnectivityRoute {
  const route = routes
    .filter((item) => item.healthy)
    .sort((a, b) => b.priority - a.priority)[0];

  if (!route) throw new Error("no_healthy_connectivity_route");
  return route;
}
