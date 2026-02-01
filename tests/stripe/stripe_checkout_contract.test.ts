import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

function findRoute(): string | null {
  const root = path.join(process.cwd(), "app");
  const stack: string[] = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name === "route.ts" && full.endsWith(path.join("api", "stripe", "checkout", "route.ts"))) {
        return full;
      }
    }
  }
  return null;
}

describe("stripe checkout route (exists)", () => {
  it("checkout route exists under app/api/stripe/checkout/route.ts", () => {
    const p = findRoute();
    expect(p).not.toBeNull();
    expect(fs.existsSync(p!)).toBe(true);
  });
});
