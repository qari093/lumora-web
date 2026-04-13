import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("portal route smoke suite", () => {
  const routes = [
    ["app/page.tsx", "HomePortalHub"],
    ["app/fyp/page.tsx", "FypFeedClient"],
    ["app/gmar/page.tsx", "GmarLiveClient"],
    ["app/nexa/page.tsx", "NexaLiveClient"],
    ["app/cineverse/page.tsx", "CineverseLiveClient"],
    ["app/live/page.tsx", "LivePortalClient"],
    ["app/wallet/page.tsx", "WalletLiveClient"],
    ["app/profile/page.tsx", "ProfileLiveClient"],
    ["app/portals/page.tsx", "All Active Portals"],
  ] as const;

  for (const [file, expected] of routes) {
    it(`validates ${file}`, () => {
      expect(fs.existsSync(file)).toBe(true);
      const text = fs.readFileSync(file, "utf8");
      expect(text.includes(expected)).toBe(true);
    });
  }
});
