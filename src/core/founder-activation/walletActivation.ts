export type WalletActivationSurface = {
  id: string;
  title: string;
  type: "wallet" | "economy" | "ledger" | "treasury";
  status: "founder-preview" | "safe-active";
  description: string;
};

export const walletActivationSurfaces: WalletActivationSurface[] = [
  {
    id: "wallet",
    title: "Wallet Overview",
    type: "wallet",
    status: "safe-active",
    description: "Founder-visible wallet balances and readiness."
  },
  {
    id: "economy",
    title: "Zen Economy",
    type: "economy",
    status: "safe-active",
    description: "ZenEconomy runtime visibility in safe mode."
  },
  {
    id: "ledger",
    title: "Transaction Ledger",
    type: "ledger",
    status: "founder-preview",
    description: "Founder-visible transaction history layer."
  },
  {
    id: "treasury",
    title: "Treasury View",
    type: "treasury",
    status: "founder-preview",
    description: "Treasury and governance visibility."
  }
];

export function getWalletActivationSummary() {
  return {
    status: "WALLET_ZENECONOMY_ACTIVATED_FOR_FOUNDER_REVIEW",
    walletLive: false,
    paymentsLive: false,
    zencoinBridgeLive: false,
    testerInvitesBlocked: true,
    safeMode: true
  };
}
