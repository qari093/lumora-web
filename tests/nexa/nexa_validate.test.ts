import { describe, expect, it } from "vitest";
import { getNexaRuntimeHealth } from "../../lib/nexa/runtime";
import { getNexaRuntimeMetrics } from "../../lib/nexa/metrics";
import { getNexaDiag } from "../../lib/nexa/diag";
import { validateHealth, validateMetrics, validateDiag } from "../../lib/nexa/validate";

describe("NEXA validators", () => {
  it("validateHealth accepts runtime health", () => {
    const h = getNexaRuntimeHealth();
    expect(validateHealth(h).ok).toBe(true);
  });

  it("validateMetrics accepts runtime metrics", () => {
    const m = getNexaRuntimeMetrics();
    expect(validateMetrics(m).ok).toBe(true);
  });

  it("validateDiag accepts diag snapshot (partial-safe)", () => {
    const d = getNexaDiag();
    expect(validateDiag(d).ok).toBe(true);
  });

  it("rejects invalid shapes", () => {
    expect(validateHealth(null).ok).toBe(false);
    expect(validateMetrics({ ok: true }).ok).toBe(false);
    expect(validateDiag({ ok: true, ts: 1, health: {}, metrics: {} }).ok).toBe(false);
  });
});
