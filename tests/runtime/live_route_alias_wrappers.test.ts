import { describe, expect, it } from "vitest";
import fs from "node:fs";

const aliasFiles = [
  "app/api/live/room/route.ts",
  "app/api/live/room-list/route.ts",
  "app/api/live/roomlist/route.ts",
  "app/api/live/rooms-list/route.ts",
  "app/api/live/roomslist/route.ts",
  "app/api/live/rooms/list/route.ts",
  "app/api/live/rooms/public/route.ts"
];

describe("live route alias compatibility wrappers", () => {
  it("converts live duplicate aliases to canonical wrappers", () => {
    for (const file of aliasFiles) {
      if (!fs.existsSync(file)) continue;
      const src = fs.readFileSync(file, "utf8");
      expect(src).toContain("compatibilityJson");
      expect(src).toContain("/api/live/rooms");
      expect(src).not.toContain("raw-audit");
    }
  });

  it("writes alias hardening audit artifact", () => {
    expect(fs.existsSync(".lumora-audits/live-route-alias-compatibility-wrappers.json")).toBe(true);
  });
});
