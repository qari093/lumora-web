import type {
  IntegrationSurface
} from "../types";

export function createIntegrationSurface(): IntegrationSurface {
  return {
    id: "surface_001",
    route: "/api/lumaspace/runtime",
    enabled: true
  };
}
