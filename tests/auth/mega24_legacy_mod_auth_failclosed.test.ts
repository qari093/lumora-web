import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

describe("Mega Step 24 legacy moderation authorization fail-closed boundary", () => {
  it("removes the literal development moderation key fallback", () => {
    const source = read("src/lib/mod/auth.ts");

    expect(source).toContain("MOD_ADMIN_KEY");
    expect(source).not.toMatch(/\|\|\s*["']dev["']/);
    expect(source).toContain("if (!envKey)");
    expect(source).toContain("return { ok: false }");
  });

  it("does not expose any portion of the moderation secret as actor identity", () => {
    const source = read("src/lib/mod/auth.ts");

    expect(source).not.toContain("envKey.slice(");
    expect(source).toContain('who: "admin:mod-key"');
  });

  for (const route of [
    "app/api/mod/action/route.ts",
    "app/api/mod/queue/route.ts",
  ]) {
    it(`${route} remains protected by modKeyOk`, () => {
      const source = read(route);

      expect(source).toContain("modKeyOk");
      expect(source).toContain("if (!auth.ok)");
      expect(source).toContain("UNAUTHORIZED");
    });
  }
});
