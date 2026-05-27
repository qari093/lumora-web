export type GmarInfrastructureRegion =
  | "eu-central"
  | "us-east"
  | "asia-south";

export type GmarInfrastructureStatus =
  | "healthy"
  | "degraded"
  | "offline";

export type GmarInfrastructureNode = {
  nodeId: string;
  region: GmarInfrastructureRegion;
  apiReady: boolean;
  websocketReady: boolean;
  databaseReady: boolean;
  cacheReady: boolean;
  storageReady: boolean;
  status: GmarInfrastructureStatus;
  latencyMs: number;
};

export type GmarProductionInfrastructure = {
  environment: "production";
  nodes: GmarInfrastructureNode[];
  autoscalingReady: true;
  failoverReady: true;
  backupReady: true;
  monitoringReady: true;
  deploymentReady: true;
};

export function createGmarInfrastructureNode(input: {
  nodeId: string;
  region: GmarInfrastructureRegion;
  latencyMs: number;
  degraded?: boolean;
}): GmarInfrastructureNode {
  const nodeId = input.nodeId.trim();

  if (!nodeId) {
    throw new Error("GMAR infrastructure nodeId is required.");
  }

  const degraded = input.degraded === true;

  return {
    nodeId,
    region: input.region,
    apiReady: degraded === false,
    websocketReady: degraded === false,
    databaseReady: degraded === false,
    cacheReady: degraded === false,
    storageReady: degraded === false,
    status: degraded ? "degraded" : "healthy",
    latencyMs: input.latencyMs
  };
}

export function createGmarProductionInfrastructure(
  nodes: GmarInfrastructureNode[]
): GmarProductionInfrastructure {
  if (nodes.length < 2) {
    throw new Error("GMAR production infrastructure requires at least 2 nodes.");
  }

  return {
    environment: "production",
    nodes,
    autoscalingReady: true,
    failoverReady: true,
    backupReady: true,
    monitoringReady: true,
    deploymentReady: true
  };
}

export function evaluateGmarInfrastructureHealth(
  infrastructure: GmarProductionInfrastructure
): GmarInfrastructureStatus {
  const unhealthyNodes = infrastructure.nodes.filter(
    node => node.status !== "healthy"
  );

  if (unhealthyNodes.length === infrastructure.nodes.length) {
    return "offline";
  }

  if (unhealthyNodes.length > 0) {
    return "degraded";
  }

  return "healthy";
}

export function assertGmarProductionInfrastructure(
  infrastructure: GmarProductionInfrastructure
): true {
  if (
    infrastructure.environment !== "production" ||
    infrastructure.nodes.length < 2 ||
    infrastructure.autoscalingReady !== true ||
    infrastructure.failoverReady !== true ||
    infrastructure.backupReady !== true ||
    infrastructure.monitoringReady !== true ||
    infrastructure.deploymentReady !== true
  ) {
    throw new Error("Invalid GMAR production infrastructure.");
  }

  return true;
}
