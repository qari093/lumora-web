export type HomeBeaconEconomyState = {
  zencoinConnected: boolean;
  pulseConnected: boolean;
  harmonyConnected: boolean;
  passiveIndicators: boolean;
  spendingIndicator: boolean;
  earningIndicator: boolean;
};

export function getHomeBeaconEconomyState(): HomeBeaconEconomyState {
  return {
    zencoinConnected: true,
    pulseConnected: true,
    harmonyConnected: true,
    passiveIndicators: true,
    spendingIndicator: true,
    earningIndicator: true,
  };
}

export function homeBeaconEconomyReady(): boolean {
  const state = getHomeBeaconEconomyState();
  return Object.values(state).every(Boolean);
}
