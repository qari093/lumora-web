import type {
  SecuritySeal,
  RecoveryNode,
  DeploymentRuntime
} from "../types";

export function validateSecuritySeal(
  seal: SecuritySeal
): boolean {
  return Boolean(
    seal.id &&
    seal.layer
  );
}

export function validateRecoveryNode(
  node: RecoveryNode
): boolean {
  return Boolean(
    node.id &&
    typeof node.standby === "boolean"
  );
}

export function validateDeploymentRuntime(
  runtime: DeploymentRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.sealId
  );
}
