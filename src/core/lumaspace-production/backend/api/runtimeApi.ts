import type { ApiSurface } from "../types";

export function createRuntimeApi(): ApiSurface {
  return {
    route: "/api/lumaspace/runtime",
    secured: true
  };
}
