import { describe, expect, it } from "vitest";
import { evaluateBudgetGuardrails } from "@/lib/ads/budgetGuardrails";

describe("budget & spend guardrails", () => {
  it("allows serving when budgets are healthy", () => {
    const out = evaluateBudgetGuardrails({
      campaignId: "camp_1",
      dailyBudget: 100,
      spentToday: 40,
      lifetimeBudget: 1000,
      spentLifetime: 400,
      reservePct: 10,
      isActive: true,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.state.canServe).toBe(true);
      expect(out.state.remainingDaily).toBe(60);
    }
  });

  it("blocks serving when daily budget is exhausted", () => {
    const out = evaluateBudgetGuardrails({
      campaignId: "camp_1",
      dailyBudget: 100,
      spentToday: 100,
      lifetimeBudget: 1000,
      spentLifetime: 400,
      reservePct: 10,
      isActive: true,
    });

    expect(out.ok).toBe(true);
    if (out.ok) expect(out.state.canServe).toBe(false);
  });

  it("blocks serving when reserve threshold is hit", () => {
    const out = evaluateBudgetGuardrails({
      campaignId: "camp_1",
      dailyBudget: 100,
      spentToday: 91,
      lifetimeBudget: 1000,
      spentLifetime: 400,
      reservePct: 10,
      isActive: true,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.state.reserveAmount).toBe(10);
      expect(out.state.canServe).toBe(false);
    }
  });

  it("blocks inactive campaign", () => {
    const out = evaluateBudgetGuardrails({
      campaignId: "camp_1",
      dailyBudget: 100,
      spentToday: 20,
      lifetimeBudget: 1000,
      spentLifetime: 100,
      reservePct: 5,
      isActive: false,
    });

    expect(out.ok).toBe(true);
    if (out.ok) expect(out.state.canServe).toBe(false);
  });

  it("rejects invalid reserve pct", () => {
    const out = evaluateBudgetGuardrails({
      campaignId: "camp_1",
      dailyBudget: 100,
      spentToday: 20,
      lifetimeBudget: 1000,
      spentLifetime: 100,
      reservePct: 120,
      isActive: true,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_reserve_pct" });
  });
});
