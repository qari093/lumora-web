import type { BackendRuntime } from "../types";
import { createRuntimeApi } from "../api/runtimeApi";

export function runBackendRuntime(): BackendRuntime {
  return {
    active: true,
    routes: [
      createRuntimeApi()
    ]
  };
}
