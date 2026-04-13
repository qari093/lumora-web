export type ProductionDeploymentPrepInput = {
  buildReady?: boolean | null;
  envReady?: boolean | null;
  healthReady?: boolean | null;
  deploymentTarget?: string | null;
};

export type ProductionDeploymentPrepResult =
  | {
      ok: true;
      prep: {
        buildReady: boolean;
        envReady: boolean;
        healthReady: boolean;
        deploymentTarget: string;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

function clean(v?: string | null) {
  return (v ?? "").trim();
}

export function evaluateProductionDeploymentPrep(
  input: ProductionDeploymentPrepInput
): ProductionDeploymentPrepResult {
  const buildReady = Boolean(input.buildReady);
  const envReady = Boolean(input.envReady);
  const healthReady = Boolean(input.healthReady);
  const deploymentTarget = clean(input.deploymentTarget);

  if (!deploymentTarget) return { ok: false, reason: "missing_deployment_target" };
  if (!["cloudflare", "vercel", "railway", "render", "docker"].includes(deploymentTarget)) {
    return { ok: false, reason: "invalid_deployment_target" };
  }

  return {
    ok: true,
    prep: {
      buildReady,
      envReady,
      healthReady,
      deploymentTarget,
      ready: buildReady && envReady && healthReady,
    },
  };
}
