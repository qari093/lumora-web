import type { DeploymentRuntime } from "../types";

export function runDeploymentRuntime(): DeploymentRuntime {
  return {
    active: true,
    region: "eu-central"
  };
}
