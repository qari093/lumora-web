import type {
  CivilizationSurface,
  RuntimeBridge,
  BackendRuntime
} from "../types";

export function validateCivilizationSurface(
  surface: CivilizationSurface
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
    typeof bridge.connected === "boolean"
  );
}

export function validateBackendRuntime(
  runtime: BackendRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.bridgeId
  );
}
