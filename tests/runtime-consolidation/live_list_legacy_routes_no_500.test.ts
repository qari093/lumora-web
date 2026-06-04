import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Live list legacy routes do not crash", () => {
  const files = [
    "app/api/live/room-list/route.ts",
    "app/api/live/rooms/list/route.ts",
    "app/api/live/rooms/public/route.ts",
  ];

  it("keeps legacy list route files present", () => {
    for (const file of files) {
      expect(fs.existsSync(file)).toBe(true);
    }
  });

  it("marks legacy list routes as deprecated wrappers", () => {
    for (const file of files) {
      const src = fs.readFileSync(file, "utf8");
      expect(src).toContain("ROUTE_DEPRECATED");
      expect(src).toContain("/api/live/rooms");
      expect(src).toContain("status: 410");
      expect(src).toContain("x-lumora-canonical-route");
    }
  });
});
