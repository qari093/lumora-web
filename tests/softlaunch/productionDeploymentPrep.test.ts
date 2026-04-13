import { describe, expect, it } from "vitest";
import { evaluateProductionDeploymentPrep } from "@/lib/softlaunch/productionDeploymentPrep";

describe("soft-launch production deployment prep", () => {
  it("passes when all deployment requirements are ready", () => {
    const out = evaluateProductionDeploymentPrep({
      buildReady: true,
      envReady: true,
      healthReady: true,
      deploymentTarget: "cloudflare",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.prep.ready).toBe(true);
      expect(out.prep.deploymentTarget).toBe("cloudflare");
    }
  });

  it("stays not-ready if one requirement is missing", () => {
    const out = evaluateProductionDeploymentPrep({
      buildReady: true,
      envReady: false,
      healthReady: true,
      deploymentTarget: "cloudflare",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.prep.ready).toBe(false);
    }
  });

  it("rejects missing deployment target", () => {
    const out = evaluateProductionDeploymentPrep({
      buildReady: true,
      envReady: true,
      healthReady: true,
      deploymentTarget: "",
    });

    expect(out).toEqual({ ok: false, reason: "missing_deployment_target" });
  });

  it("rejects unsupported deployment target", () => {
    const out = evaluateProductionDeploymentPrep({
      buildReady: true,
      envReady: true,
      healthReady: true,
      deploymentTarget: "firebase",
    });

    expect(out).toEqual({ ok: false, reason: "invalid_deployment_target" });
  });
});
