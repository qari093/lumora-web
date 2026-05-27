export type WalletState =
  | "active"
  | "locked"
  | "review"
  | "offline"
  | "recovering";

export type WalletSnapshot = {
  walletId: string;
  zencoin: number;
  refundCredit: number;
  state: WalletState;
  updatedAt: string;
};

export function createWalletSnapshot(walletId: string): WalletSnapshot {
  return {
    walletId,
    zencoin: 0,
    refundCredit: 0,
    state: "active",
    updatedAt: new Date().toISOString(),
  };
}
