import { getWallet } from "../registry/walletRegistry";
import { emitWalletEvent } from "../events/eventBus";

export function initializeWallet(walletId: string) {
  const wallet = getWallet(walletId);

  emitWalletEvent("wallet_initialized", {
    walletId,
  });

  return wallet;
}
