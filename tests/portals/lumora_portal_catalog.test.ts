import { describe, expect, it } from "vitest";
import {
  getActivePortals,
  getPortalById,
  lumoraPortals,
  portalCatalogHealthy
} from "../../src/core/lumora/portal-catalog/portalCatalog";

describe("Lumora portal catalog", () => {
  it("contains all major Lumora portals", () => {
    expect(lumoraPortals.length).toBeGreaterThanOrEqual(10);
    expect(getPortalById("fyp")?.name).toBe("Lumora FYP");
    expect(getPortalById("nexa")?.status).toBe("sealed");
    expect(getPortalById("zencoin")?.status).toBe("sealed");
  });

  it("contains feature, integration and monetization data", () => {
    for (const portal of lumoraPortals) {
      expect(portal.coreFeatures.length).toBeGreaterThan(0);
      expect(portal.integrations.length).toBeGreaterThan(0);
      expect(portal.monetization.length).toBeGreaterThan(0);
    }
  });

  it("exposes active/sealed portals", () => {
    expect(getActivePortals().some((portal) => portal.id === "echo")).toBe(true);
    expect(getActivePortals().some((portal) => portal.id === "nexa")).toBe(true);
  });

  it("validates catalog health", () => {
    expect(portalCatalogHealthy()).toBe(true);
  });
});
