import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const requiredFiles = [
  "app/lumalink/page.tsx",
  "app/api/lumalink/health/route.ts",
  "app/api/lumalink/connections/route.ts",
  "app/api/lumalink/relationships/route.ts",
  "app/api/lumalink/groups/route.ts",
  "app/api/lumalink/messages/route.ts",
  "app/api/lumalink/presence/route.ts",
  "src/core/lumalink/runtime.ts",
];

describe("LumaLink 3.0 canonical route presence", () => {
  for (const file of requiredFiles) {
    it(`has ${file}`, () => {
      expect(() => readFileSync(file, "utf8")).not.toThrow();
    });
  }

  it("exposes route handlers", () => {
    const combined = requiredFiles
      .filter((file) => file.includes("/api/"))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(combined).toContain("export async function GET");
    expect(combined).toContain("export async function POST");
    expect(combined).toContain("NextResponse.json");
  });
});
