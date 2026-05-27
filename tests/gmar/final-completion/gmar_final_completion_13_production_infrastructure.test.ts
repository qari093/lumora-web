import {
  createGmarInfrastructureNode,
  createGmarProductionInfrastructure,
  evaluateGmarInfrastructureHealth,
  assertGmarProductionInfrastructure
} from "@/src/core/gmar/final-completion/infrastructure/productionInfrastructure";

describe("GMAR Final Completion Phase 13 — Production Infrastructure", () => {
  it("creates healthy production infrastructure", () => {
    const infrastructure = createGmarProductionInfrastructure([
      createGmarInfrastructureNode({
        nodeId: "gmar-eu-01",
        region: "eu-central",
        latencyMs: 34
      }),
      createGmarInfrastructureNode({
        nodeId: "gmar-us-01",
        region: "us-east",
        latencyMs: 82
      })
    ]);

    expect(infrastructure.environment).toBe("production");
    expect(infrastructure.nodes).toHaveLength(2);
    expect(infrastructure.autoscalingReady).toBe(true);
    expect(infrastructure.failoverReady).toBe(true);
    expect(infrastructure.backupReady).toBe(true);
    expect(infrastructure.monitoringReady).toBe(true);
    expect(infrastructure.deploymentReady).toBe(true);

    expect(evaluateGmarInfrastructureHealth(infrastructure)).toBe("healthy");
    expect(assertGmarProductionInfrastructure(infrastructure)).toBe(true);
  });

  it("detects degraded infrastructure", () => {
    const infrastructure = createGmarProductionInfrastructure([
      createGmarInfrastructureNode({
        nodeId: "gmar-eu-01",
        region: "eu-central",
        latencyMs: 34
      }),
      createGmarInfrastructureNode({
        nodeId: "gmar-us-01",
        region: "us-east",
        latencyMs: 82,
        degraded: true
      })
    ]);

    expect(evaluateGmarInfrastructureHealth(infrastructure)).toBe("degraded");
  });

  it("detects offline infrastructure", () => {
    const infrastructure = createGmarProductionInfrastructure([
      createGmarInfrastructureNode({
        nodeId: "gmar-eu-01",
        region: "eu-central",
        latencyMs: 34,
        degraded: true
      }),
      createGmarInfrastructureNode({
        nodeId: "gmar-us-01",
        region: "us-east",
        latencyMs: 82,
        degraded: true
      })
    ]);

    expect(evaluateGmarInfrastructureHealth(infrastructure)).toBe("offline");
  });

  it("rejects insufficient nodes", () => {
    expect(() =>
      createGmarProductionInfrastructure([
        createGmarInfrastructureNode({
          nodeId: "gmar-eu-01",
          region: "eu-central",
          latencyMs: 34
        })
      ])
    ).toThrow("GMAR production infrastructure requires at least 2 nodes.");
  });
});
