import type { SecuritySeal, MonitoringSignal, DeploymentRuntime } from "../types";

export function validateSecuritySeal(seal: SecuritySeal): boolean {
  return Boolean(seal.id && seal.hardened === true);
}

export function validateMonitoringSignal(signal: MonitoringSignal): boolean {
  return Boolean(signal.id && signal.latencyMs >= 0);
}

export function validateDeploymentRuntime(runtime: DeploymentRuntime): boolean {
  return Boolean(runtime.active === true && runtime.region);
}
