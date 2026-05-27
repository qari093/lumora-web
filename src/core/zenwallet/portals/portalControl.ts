export type PortalId = "fyp" | "live" | "gmar" | "nexa" | "zendoro" | "cineverse" | "share";

export type PortalPolicy = {
  portal: PortalId;
  dailyCap: number;
  allowsRankingBoost: boolean;
  allowsPayToWin: boolean;
};

export const PORTAL_POLICIES: Record<PortalId, PortalPolicy> = {
  fyp: { portal: "fyp", dailyCap: 50, allowsRankingBoost: false, allowsPayToWin: false },
  live: { portal: "live", dailyCap: 20, allowsRankingBoost: false, allowsPayToWin: false },
  gmar: { portal: "gmar", dailyCap: 60, allowsRankingBoost: false, allowsPayToWin: false },
  nexa: { portal: "nexa", dailyCap: 40, allowsRankingBoost: false, allowsPayToWin: false },
  zendoro: { portal: "zendoro", dailyCap: 100, allowsRankingBoost: false, allowsPayToWin: false },
  cineverse: { portal: "cineverse", dailyCap: 30, allowsRankingBoost: false, allowsPayToWin: false },
  share: { portal: "share", dailyCap: 10, allowsRankingBoost: false, allowsPayToWin: false },
};

export function authorizePortalSpend(portal: PortalId, amount: number, zenLock = false) {
  const policy = PORTAL_POLICIES[portal];
  if (zenLock) return { ok: false, reason: "zenlock_enabled" };
  if (amount > policy.dailyCap) return { ok: false, reason: "daily_cap_exceeded" };
  return { ok: true, reason: "authorized" };
}
