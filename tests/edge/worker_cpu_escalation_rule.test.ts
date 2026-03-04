import { describe, it, expect } from "vitest";
import { shouldEscalateToOrigin, DEFAULT_WORKER_CPU_BUDGET_MS } from "@/lib/edge/compute/workerBudget";

describe("worker CPU escalation rule (CPU < 50ms contract)", () => {
  it("defaults to 50ms budget and stays within budget", () => {
    const d = shouldEscalateToOrigin({ expectedCpuMs: 10 });
    expect(d.escalate).toBe(false);
    expect(d.reason).toBe("within_budget");
    expect(d.remainingMs).toBe(DEFAULT_WORKER_CPU_BUDGET_MS - 10);
  });

  it("escalates if expected CPU exceeds budget", () => {
    const d = shouldEscalateToOrigin({ expectedCpuMs: 60 });
    expect(d.escalate).toBe(true);
    expect(d.reason).toBe("cpu_over_budget");
  });

  it("respects custom budget and clamps", () => {
    const d = shouldEscalateToOrigin({ expectedCpuMs: 40, budgetMs: 45 });
    expect(d.escalate).toBe(false);
    expect(d.remainingMs).toBe(5);
  });

  it("escalates on invalid expected CPU", () => {
    const d = shouldEscalateToOrigin({ expectedCpuMs: Number.NaN });
    expect(d.escalate).toBe(true);
    expect(d.reason).toBe("invalid_expected_cpu");
  });

  it("clamps negative budget to 0 and escalates", () => {
    const d = shouldEscalateToOrigin({ expectedCpuMs: 1, budgetMs: -100 });
    expect(d.escalate).toBe(true);
    expect(d.reason).toBe("cpu_over_budget");
  });
});
