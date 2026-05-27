export type WalletRuntime = {
  active: boolean;
  balances: boolean;
  transfers: boolean;
};

export function createWalletRuntime(): WalletRuntime {
  return {
    active: true,
    balances: true,
    transfers: true
  };
}
