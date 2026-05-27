import { describe, expect, it } from "vitest";
import {
  canActivateExternalServices,
  externalServiceActivationChecklist,
} from "../../src/core/ops/external-services/activation";
import { createServiceProbe } from "../../src/core/ops/external-services/service-probe";

describe("external services activation", () => {
  it("covers all live provider activation checks", () => {
    expect(Object.keys(externalServiceActivationChecklist).length).toBeGreaterThanOrEqual(20);
    expect(canActivateExternalServices()).toBe(true);
  });

  it("creates service probes", () => {
    expect(createServiceProbe("stripe", true).ok).toBe(true);
  });
});
