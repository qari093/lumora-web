export function buildZenWalletDashboardModel() {
  return {
    title: "ZenWallet",
    desktop: "ZenSanctuary Flawless Global",
    mobile: "Flawless Compass",
    balances: {
      zencoin: { label: "Zencoin", visual: "gold_blue_orb" },
      refundCredit: { label: "Refund Credit", visual: "soft_teal_lock" },
    },
    actions: ["Buy", "Plan", "ZenLock", "Redeem", "Methods", "Pay Later"],
    statusCopy: {
      verified: "✓ Independently verified",
      pendingSync: "Pending Sync",
      chargebackReview: "A payment for a past pack is under review. We’ll contact you if anything is needed.",
    },
  };
}
