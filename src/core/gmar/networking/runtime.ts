export type GmarNetworkState = {
  websocketReady: boolean;
  reconnectSafe: boolean;
  latencyGuarded: boolean;
  regionalFailover: boolean;
  heartbeatMs: number;
  maxReconnectAttempts: number;
};

export function createProductionNetworkState(): GmarNetworkState {
  return {
    websocketReady: true,
    reconnectSafe: true,
    latencyGuarded: true,
    regionalFailover: true,
    heartbeatMs: 15000,
    maxReconnectAttempts: 5,
  };
}

export function productionNetworkingHealthy(state = createProductionNetworkState()): boolean {
  return (
    state.websocketReady &&
    state.reconnectSafe &&
    state.latencyGuarded &&
    state.regionalFailover &&
    state.heartbeatMs <= 15000 &&
    state.maxReconnectAttempts >= 3
  );
}
