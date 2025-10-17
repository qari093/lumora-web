export type ZenEconomy = {
  walletAddress: string | null;
  balance: number;           // shows as 0 on SSR; real value loads on client
  balanceCurrency: "ZC" | "ZC+"; 
  pendingRewards: number;
  lastUpdatedISO: string | null; // string to avoid Date object mismatch
};

export const INITIAL_ECONOMY: ZenEconomy = {
  walletAddress: null,
  balance: 0,
  balanceCurrency: "ZC",
  pendingRewards: 0,
  lastUpdatedISO: null
};

// Fake loader to simulate API/local restore (CLIENT ONLY)
export async function loadEconomyFromClient(): Promise<ZenEconomy> {
  // NEVER call this during SSR.
  // Try localStorage first; otherwise simulate network.
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("zen-economy") : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...INITIAL_ECONOMY, ...parsed };
    }
  } catch {}
  // Simulated fetch result
  await new Promise(r => setTimeout(r, 300)); // small delay
  const now = new Date().toISOString();
  const demo = {
    walletAddress: "zc_7f2f...b9",
    balance: 1287.5,
    balanceCurrency: "ZC" as const,
    pendingRewards: 12,
    lastUpdatedISO: now
  };
  try { if (typeof window !== "undefined") window.localStorage.setItem("zen-economy", JSON.stringify(demo)); } catch {}
  return demo;
}
