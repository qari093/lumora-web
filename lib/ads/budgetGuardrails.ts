export type BudgetGuardrailInput = {
  campaignId?: string | null;
  dailyBudget?: number | null;
  spentToday?: number | null;
  lifetimeBudget?: number | null;
  spentLifetime?: number | null;
  reservePct?: number | null;
  isActive?: boolean | null;
};

export type BudgetGuardrailResult =
  | {
      ok: true;
      state: {
        campaignId: string;
        remainingDaily: number;
        remainingLifetime: number;
        reserveAmount: number;
        canServe: boolean;
      };
    }
  | { ok: false; reason: string };

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function evaluateBudgetGuardrails(
  input: BudgetGuardrailInput
): BudgetGuardrailResult {
  const campaignId = typeof input.campaignId === "string" ? input.campaignId.trim() : "";
  const dailyBudget =
    typeof input.dailyBudget === "number" && Number.isFinite(input.dailyBudget)
      ? round2(input.dailyBudget)
      : NaN;
  const spentToday =
    typeof input.spentToday === "number" && Number.isFinite(input.spentToday)
      ? round2(input.spentToday)
      : NaN;
  const lifetimeBudget =
    typeof input.lifetimeBudget === "number" && Number.isFinite(input.lifetimeBudget)
      ? round2(input.lifetimeBudget)
      : NaN;
  const spentLifetime =
    typeof input.spentLifetime === "number" && Number.isFinite(input.spentLifetime)
      ? round2(input.spentLifetime)
      : NaN;
  const reservePct =
    typeof input.reservePct === "number" && Number.isFinite(input.reservePct)
      ? input.reservePct
      : NaN;
  const isActive = Boolean(input.isActive);

  if (!campaignId) return { ok: false, reason: "missing_campaign_id" };
  if (!Number.isFinite(dailyBudget) || dailyBudget < 0) return { ok: false, reason: "invalid_daily_budget" };
  if (!Number.isFinite(spentToday) || spentToday < 0) return { ok: false, reason: "invalid_spent_today" };
  if (!Number.isFinite(lifetimeBudget) || lifetimeBudget < 0) return { ok: false, reason: "invalid_lifetime_budget" };
  if (!Number.isFinite(spentLifetime) || spentLifetime < 0) return { ok: false, reason: "invalid_spent_lifetime" };
  if (!Number.isFinite(reservePct) || reservePct < 0 || reservePct > 100) {
    return { ok: false, reason: "invalid_reserve_pct" };
  }

  const remainingDaily = round2(Math.max(0, dailyBudget - spentToday));
  const remainingLifetime = round2(Math.max(0, lifetimeBudget - spentLifetime));
  const reserveAmount = round2((dailyBudget * reservePct) / 100);
  const canServe =
    isActive &&
    spentToday < dailyBudget &&
    spentLifetime < lifetimeBudget &&
    remainingDaily > reserveAmount &&
    remainingLifetime > 0;

  return {
    ok: true,
    state: {
      campaignId,
      remainingDaily,
      remainingLifetime,
      reserveAmount,
      canServe,
    },
  };
}
