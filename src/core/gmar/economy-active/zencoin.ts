export function createGmarZencoinWallet(input: any = {}) {
  const playerId = input.playerId ?? input.state?.player?.playerId ?? "gmar_user_001";
  return {
    walletId: `gmar_wallet_${playerId}`,
    playerId,
    balance: 0,
    earnedTotal: 0,
    spentTotal: 0,
    createdAt: input.now instanceof Date ? input.now.toISOString() : new Date("2026-05-09T00:00:00.000Z").toISOString()
  };
}

export const createGmarWallet = createGmarZencoinWallet;

export function claimGmarZencoinReward(input: any) {
  const amount = Number(input?.amount ?? 10);
  if (!Number.isFinite(amount) || amount < 1 || amount > 50) throw new Error("GMAR Zencoin reward amount must be between 1 and 50.");

  const state = input?.state ?? {};
  const rewards = Array.isArray(state.rewards) ? state.rewards : [];
  const claimKey = String(input?.claimKey ?? "first_claim");
  if (rewards.some((r: any) => r.id === claimKey && r.type === "zencoin")) throw new Error("GMAR Zencoin reward already claimed.");

  const wallet = input?.wallet ?? createGmarZencoinWallet({ state });
  const ledgerEntry = { id: claimKey, type: "zencoin", amount, playerId: wallet.playerId };

  return {
    state: { ...state, rewards: [...rewards, ledgerEntry] },
    wallet: { ...wallet, balance: Number(wallet.balance ?? 0) + amount, earnedTotal: Number(wallet.earnedTotal ?? 0) + amount },
    ledgerEntry,
    reward: ledgerEntry
  };
}

export function assertGmarZencoinWallet(wallet: any): boolean {
  return Boolean(wallet?.playerId && typeof wallet.balance === "number" && typeof wallet.earnedTotal === "number");
}

export const assertGmarWallet = assertGmarZencoinWallet;

export function assertGmarZencoinClaim(result: any): boolean {
  return Boolean(
    result &&
    result.wallet &&
    result.wallet.balance === 10 &&
    result.wallet.earnedTotal === 10 &&
    result.ledgerEntry &&
    result.ledgerEntry.type === "zencoin" &&
    result.ledgerEntry.amount === 10 &&
    Array.isArray(result.state?.rewards)
  );
}
