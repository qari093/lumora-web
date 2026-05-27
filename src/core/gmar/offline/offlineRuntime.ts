export function offlineMode(enabled: boolean) {
  return {
    enabled,
    syncPending: enabled
  };
}
