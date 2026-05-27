import {
  createIntegrationSurface
} from "../api/runtimeSurface";

import {
  createRuntimeBridge
} from "./runtimeBridge";

export function runIntegrationRuntime() {
  return {
    active: true,
    surface: createIntegrationSurface(),
    bridge: createRuntimeBridge()
  };
}
