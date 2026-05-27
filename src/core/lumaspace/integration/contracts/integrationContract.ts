import type {
  IntegrationSurface,
  RuntimeBridge,
  IntegrationRuntime
} from "../types";

export function validateIntegrationSurface(
  surface: IntegrationSurface
): boolean {
  return Boolean(
    surface.id &&
    surface.route
  );
}

export function validateRuntimeBridge(
  bridge: RuntimeBridge
): boolean {
  return Boolean(
    bridge.id &&
    bridge.target
  );
}

export function validateIntegrationRuntime(
  runtime: IntegrationRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    validateIntegrationSurface(runtime.surface)
  );
}
