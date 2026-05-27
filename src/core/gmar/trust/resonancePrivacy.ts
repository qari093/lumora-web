export type ResonancePrivacyState = {
  clientFirst: true;
  serverStoresOnlyVoluntaryCluster: true;
  exportAllowed: true;
  deleteAllowed: true;
  spendingTargetingAllowed: false;
  manipulativeMatchmakingAllowed: false;
};

export function createResonancePrivacyState(): ResonancePrivacyState {
  return {
    clientFirst: true,
    serverStoresOnlyVoluntaryCluster: true,
    exportAllowed: true,
    deleteAllowed: true,
    spendingTargetingAllowed: false,
    manipulativeMatchmakingAllowed: false,
  };
}

export function resonancePrivacyHealthy(state = createResonancePrivacyState()): boolean {
  return (
    state.clientFirst &&
    state.serverStoresOnlyVoluntaryCluster &&
    state.exportAllowed &&
    state.deleteAllowed &&
    !state.spendingTargetingAllowed &&
    !state.manipulativeMatchmakingAllowed
  );
}
