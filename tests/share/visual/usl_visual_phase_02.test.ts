import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  createPortalShareIntegrationManifest,
  createSharePortalRouteMap,
  validatePortalShareIntegrationManifest,
} from "@/src/core/share";

function exists(path: string) {
  return fs.existsSync(path);
}

function read(path: string) {
  return exists(path) && fs.statSync(path).isFile() ? fs.readFileSync(path, "utf8") : "";
}

describe("USL Visual Route Integration — Phase 02/06 Route & Portal Integration", () => {
  it("locks the canonical portal route map", () => {
    const routes = createSharePortalRouteMap();

    expect(routes).toHaveLength(8);
    expect(routes.find((route) => route.portal === "fyp")?.destination).toBe("lumaspace");
    expect(routes.find((route) => route.portal === "lumaspace")?.shareMode).toBe("silent");
    expect(routes.find((route) => route.portal === "zendoro")?.shareMode).toBe("gift");
    expect(routes.find((route) => route.portal === "share")?.route).toBe("/share");
  });

  it("verifies the production route integration manifest", () => {
    const manifest = createPortalShareIntegrationManifest();

    expect(validatePortalShareIntegrationManifest(manifest)).toBe(true);
    expect(manifest.fypToLumaSpace).toBe(true);
    expect(manifest.requiredPortals).toContain("live");
    expect(manifest.requiredPortals).toContain("zendoro");
    expect(manifest.requiredPortals).toContain("lumexa");
  });

  it("verifies core route files or route directories exist", () => {
    const required = [
      "app/share/page.tsx",
      "app/fyp",
      "app/lumaspace/page.tsx",
      "app/live",
    ];

    for (const path of required) {
      expect(exists(path), `${path} missing`).toBe(true);
    }
  });

  it("verifies /share is wired through provider and reusable share triggers", () => {
    const client = read("app/share/ShareDemoClient.tsx");
    const provider = read("src/components/share/UniversalShareProvider.tsx");
    const button = read("src/components/share/UniversalShareButton.tsx");
    const fab = read("src/components/share/UniversalShareFab.tsx");

    expect(client).toContain("UniversalShareProvider");
    expect(client).toContain("UniversalShareButton");
    expect(client).toContain("UniversalShareFab");
    expect(provider).toContain("openShare");
    expect(button).toContain("openShare");
    expect(fab).toContain("openShare");
  });

  it("verifies cross-portal transformation and living-memory route targets exist in runtime", () => {
    const transformation = read("src/core/share/transformations/adapters.ts");
    const memories = read("src/core/share/memories/star.ts");
    const relationships = read("src/core/share/relationships/index.ts");

    expect(transformation).toContain("lumaspace");
    expect(transformation).toContain("lumalink");
    expect(memories).toContain("MemoryStar");
    expect(relationships).toContain("prediction");
  });
});
