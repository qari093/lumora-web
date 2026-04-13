export type ProductionBuildStartInput = {
  buildSucceeded?: boolean | null;
  serverStarted?: boolean | null;
  healthEndpointOk?: boolean | null;
  port?: number | null;
};

export type ProductionBuildStartResult =
  | {
      ok: true;
      verification: {
        buildSucceeded: boolean;
        serverStarted: boolean;
        healthEndpointOk: boolean;
        port: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateProductionBuildStartVerification(
  input: ProductionBuildStartInput
): ProductionBuildStartResult {
  const buildSucceeded = Boolean(input.buildSucceeded);
  const serverStarted = Boolean(input.serverStarted);
  const healthEndpointOk = Boolean(input.healthEndpointOk);
  const port =
    typeof input.port === "number" && Number.isFinite(input.port)
      ? Math.trunc(input.port)
      : NaN;

  if (!Number.isFinite(port) || port <= 0 || port > 65535) {
    return { ok: false, reason: "invalid_port" };
  }

  return {
    ok: true,
    verification: {
      buildSucceeded,
      serverStarted,
      healthEndpointOk,
      port,
      ready: buildSucceeded && serverStarted && healthEndpointOk,
    },
  };
}
