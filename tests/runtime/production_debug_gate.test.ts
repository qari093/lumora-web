import { describe, expect, it, vi, afterEach } from "vitest";
import {
  isProductionRuntime,
  isDebugRouteAllowed,
  productionDebugGate
} from "@/src/lib/runtime-guards/productionDebugGate";

describe("production debug route gate", () => {
  const OLD_ENV = process.env;

  afterEach(() => {
    process.env = { ...OLD_ENV };
    vi.unstubAllEnvs();
  });

  it("detects production runtime from VERCEL_ENV", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isProductionRuntime()).toBe(true);
  });

  it("blocks debug routes in production by default", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("LUMORA_ALLOW_PROD_DEBUG_ROUTES", "");
    const response = productionDebugGate();
    expect(response).not.toBeNull();
    expect(response?.status).toBe(404);
  });

  it("allows debug routes only with explicit override", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("LUMORA_ALLOW_PROD_DEBUG_ROUTES", "true");
    expect(isDebugRouteAllowed()).toBe(true);
    expect(productionDebugGate()).toBeNull();
  });
});
