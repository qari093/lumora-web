import { describe, expect, it } from "vitest";

import {
  validateApiSurface,
  validateQueueJob,
  validateBackendRuntime
} from "@/src/core/lumaspace-production/backend/contracts/backendContract";

import {
  createRuntimeApi
} from "@/src/core/lumaspace-production/backend/api/runtimeApi";

import {
  createQueueJob
} from "@/src/core/lumaspace-production/backend/queue/runtimeQueue";

import {
  runBackendRuntime
} from "@/src/core/lumaspace-production/backend/runtime/backendRuntime";

describe("LumaSpace Production Pack 07 Backend Civilization", () => {
  it("creates runtime api", () => {
    expect(validateApiSurface(createRuntimeApi())).toBe(true);
  });

  it("creates queue job", () => {
    expect(validateQueueJob(createQueueJob("sync"))).toBe(true);
  });

  it("runs backend runtime", () => {
    expect(validateBackendRuntime(runBackendRuntime())).toBe(true);
  });
});
