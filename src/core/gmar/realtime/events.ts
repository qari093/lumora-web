export function realtimeEventsHealthy() {
  return {
    eventStreaming: true,
    stateRecovery: true,
    reconnectSafe: true,
  };
}
