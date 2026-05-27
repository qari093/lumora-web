import { describe, expect, it } from "vitest";
import { runtimeHealthSeal } from "../../src/echo/observability/runtimeHealth";
import { analyticsPipeline } from "../../src/echo/observability/analytics";
import { errorRecovery } from "../../src/echo/observability/errors";
import { scalingObservability } from "../../src/echo/observability/scaling";

describe("Echo Pack 17 — Observability", () => {
  it("supports runtime health", () => {
    expect(runtimeHealthSeal().healthy).toBe(true);
  });

  it("supports analytics and recovery", () => {
    expect(analyticsPipeline().tracking).toBe(true);
    expect(errorRecovery().protected).toBe(true);
  });

  it("supports scaling observability", () => {
    expect(scalingObservability().scalable).toBe(true);
  });
});
