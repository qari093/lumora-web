import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("launch api smoke suite", () => {
  const routes = [
    ["app/api/portals/route.ts", "getActivePortals"],
    ["app/api/portal-status/route.ts", "getPortalStatusManifest"],
    ["app/api/portal-health/route.ts", "getPortalHealthMatrix"],
    ["app/api/portal-cards/route.ts", "getPortalCards"],
    ["app/api/portal-overview/route.ts", "getPortalOverview"],
    ["app/api/launch/readiness/route.ts", "getLaunchReadiness"],
    ["app/api/fyp/summary/route.ts", "lumora_fyp_summary_v1"],
    ["app/api/gmar/summary/route.ts", "lumora_gmar_summary_v1"],
    ["app/api/nexa/summary/route.ts", "lumora_nexa_summary_v1"],
    ["app/api/cineverse/summary/route.ts", "lumora_cineverse_summary_v1"],
    ["app/api/live/summary/route.ts", "lumora_live_summary_v1"],
    ["app/api/wallet/summary/route.ts", "lumora_wallet_summary_v1"],
    ["app/api/profile/summary/route.ts", "lumora_profile_summary_v1"],
  ] as const;

  for (const [file, expected] of routes) {
    it(`validates ${file}`, () => {
      expect(fs.existsSync(file)).toBe(true);
      const text = fs.readFileSync(file, "utf8");
      expect(text.includes(expected)).toBe(true);
      expect(text.includes("NextResponse")).toBe(true);
    });
  }
});
