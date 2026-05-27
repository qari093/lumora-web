export const cardRuntime = {
  virtualCardEnabled: true,
  appleWallet: true,
  googleWallet: true,
  fraudDetection: true,
  cardFreeze: true,
  secureProvisioning: true
};

export function cardRuntimeHealthy(): boolean {
  return Object.values(cardRuntime).every(Boolean);
}
