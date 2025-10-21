import { getWallet, debit } from "@/src/lib/wallet/mem";
import { getLowBalanceThreshold, emitNotification } from "@/src/lib/notify/store";
import { getCampaign, setState } from "@/src/lib/vendor/campaign";
import { computeCampaignSpendEuros } from "@/src/lib/vendor/campaign_spend";

declare global {
  // eslint-disable-next-line no-var
  var __AD_PAUSED: Set<string> | undefined;
}
const PAUSED: Set<string> = (globalThis.__AD_PAUSED ||= new Set());

// Dev pricing (EUR)
export const PRICE_PER_IMP_EUR = 0.01;
export const PRICE_PER_CLICK_EUR = 0.25;

export function isPaused(ownerId: string): boolean { return PAUSED.has(ownerId); }
export function pause(ownerId: string) { PAUSED.add(ownerId); }
export function resume(ownerId: string) { PAUSED.delete(ownerId); }

export function budgetStatus(ownerId: string) {
  const bal = getWallet(ownerId).euros;
  return { balance: bal, paused: isPaused(ownerId) };
}

export function ensureBudget(ownerId: string) {
  const { balance, paused } = budgetStatus(ownerId);
  if (paused) return { ok: false, reason: "PAUSED_LOW_BALANCE" as const, balance };
  if (balance <= 0) return { ok: false, reason: "LOW_BALANCE" as const, balance };
  return { ok: true as const, balance };
}

/** Try to charge; if campaign provided, attribute reason & enforce campaign budget (auto-pause campaign). */
export function charge(ownerId: string, kind: "imp" | "click", requestId?: string | null, campaignId?: string, creativeId?: string) {
  const amount = kind === "imp" ? PRICE_PER_IMP_EUR : PRICE_PER_CLICK_EUR;

  // Enforce campaign budget BEFORE charging wallet
  if (campaignId) {
    const c = getCampaign(campaignId);
    if (!c) return { charged: false as const, reason: "NO_SUCH_CAMPAIGN" as const, amount, balance: getWallet(ownerId).euros };
    const spent = computeCampaignSpendEuros(campaignId);
    if (spent >= c.budgetEuros) {
      // auto-pause campaign
      setState(campaignId, "pause");
      return { charged: false as const, reason: "CAMPAIGN_PAUSED" as const, amount, balance: getWallet(ownerId).euros };
    }
  }

  try {
    const reason = campaignId ? `ads:${kind}:c:${creativeId || ""}:cmp:${campaignId}` : `ads:${kind}`;
    const { wallet } = debit(ownerId, amount, reason, requestId || null);
    const thr = getLowBalanceThreshold(ownerId);
    if (thr !== null && wallet.euros < thr) {
      emitNotification(ownerId, "low_balance", `Low balance: €${wallet.euros.toFixed(2)} (< €${thr.toFixed(2)})`, "Top up to keep campaigns running", { balance: wallet.euros, threshold: thr });
    }

    // Post-charge: if campaign exceeded budget now, pause it
    if (campaignId) {
      const c = getCampaign(campaignId);
      if (c) {
        const spentNow = computeCampaignSpendEuros(campaignId);
        if (spentNow >= c.budgetEuros && c.state !== "paused" && c.state !== "ended") {
          setState(campaignId, "pause");
        }
      }
    }

    return { charged: true as const, amount, balance: wallet.euros };
  } catch (e:any) {
    if (String(e?.message || e) === "INSUFFICIENT_FUNDS") {
      pause(ownerId);
      return { charged: false as const, reason: "INSUFFICIENT_FUNDS" as const, amount, balance: 0 };
    }
    return { charged: false as const, reason: String(e?.message || e), amount, balance: getWallet(ownerId).euros };
  }
}
