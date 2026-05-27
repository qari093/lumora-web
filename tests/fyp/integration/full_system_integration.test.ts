import { describe, expect, it } from "vitest";

import {
  FYP_REQUIRED_MODULES,
  createFypIntegrationStatus
} from "@/src/core/fyp/integration/moduleRegistry";

import {
  createFypSystemIntegrationReport
} from "@/src/core/fyp/integration/integrationReport";

import {
  createEndToEndFypRuntimeSeal
} from "@/src/core/fyp/integration/endToEndRuntime";

import {
  createFypReleaseSeal
} from "@/src/core/fyp/seals/fypReleaseSeal";

describe("Lumora FYP Full System Integration", () => {
  it("locks required module registry", () => {
    expect(FYP_REQUIRED_MODULES.length).toBe(11);
    expect(FYP_REQUIRED_MODULES).toContain("runtime");
  });

  it("creates complete integration report", () => {
    const report = createFypSystemIntegrationReport(
      FYP_REQUIRED_MODULES.map(module =>
        createFypIntegrationStatus({
          module,
          ready: true
        })
      )
    );

    expect(report.complete).toBe(true);
    expect(report.missingModules).toHaveLength(0);
  });

  it("detects missing modules", () => {
    const report = createFypSystemIntegrationReport([
      createFypIntegrationStatus({
        module: "foundation",
        ready: true
      })
    ]);

    expect(report.complete).toBe(false);
    expect(report.missingModules.length).toBeGreaterThan(0);
  });

  it("creates end-to-end runtime seal", () => {
    const seal = createEndToEndFypRuntimeSeal();

    expect(seal.operational).toBe(true);
    expect(seal.report.complete).toBe(true);
  });

  it("creates release seal", () => {
    const seal = createFypReleaseSeal({
      complete: true,
      testsPassed: true
    });

    expect(seal.complete).toBe(true);
    expect(seal.productionCandidate).toBe(true);
  });
});
