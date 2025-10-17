export type TreasuryStats = {
  totalSupply: number;
  circulating: number;
  lockedInStaking: number;
};

let lockedInStaking = 0;

export const TreasuryService = {
  getStats(): TreasuryStats {
    const totalSupply = 2_000_000_000; // 2B Zen
    const circulating = totalSupply - lockedInStaking;
    return { totalSupply, circulating, lockedInStaking };
  },
  lock(amount: number) {
    lockedInStaking += Math.max(0, amount);
  },
  unlock(amount: number) {
    lockedInStaking = Math.max(0, lockedInStaking - Math.max(0, amount));
  }
};
