import type { ApiSurface, QueueJob, BackendRuntime } from "../types";

export function validateApiSurface(route: ApiSurface): boolean {
  return Boolean(route.route.startsWith("/") && typeof route.secured === "boolean");
}

export function validateQueueJob(job: QueueJob): boolean {
  return Boolean(job.id && job.type && job.retries >= 0);
}

export function validateBackendRuntime(runtime: BackendRuntime): boolean {
  return Boolean(runtime.active === true && runtime.routes.every(validateApiSurface));
}
