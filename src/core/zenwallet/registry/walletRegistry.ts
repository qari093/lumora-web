import { createWalletSnapshot } from "../state/walletState";

const registry = new Map<string, ReturnType<typeof createWalletSnapshot>>();

export function getWallet(walletId: string) {
  if (!registry.has(walletId)) {
    registry.set(walletId, createWalletSnapshot(walletId));
  }

  return registry.get(walletId)!;
}

export function getWalletRegistrySize() {
  return registry.size;
}
