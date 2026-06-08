import { describe, expect, it } from "vitest";
import fs from "node:fs";

const files = [
  "app/api/live/reddit/route.ts",
  "app/api/live/youtube/route.ts"
];

describe("live external ingest guard contract", () => {
  it("keeps reddit/youtube live ingest endpoints safe in production", () => {
    for (const file of files) {
      const src = fs.readFileSync(file, "utf8");
      expect(src).toContain("safe_stub");
      expect(src).toContain("guarded");
      expect(src).toContain("no-store");
      expect(src).not.toContain("fetch(");
      expect(src).not.toContain("process.env.");
    }
  });
});
