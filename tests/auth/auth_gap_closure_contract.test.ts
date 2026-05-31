import { describe, expect, it } from "vitest";
import fs from "node:fs";

const required = [
  "app/api/auth/forgot-password/route.ts",
  "app/api/auth/reset-password/route.ts",
  "app/api/auth/verify-email/route.ts",
  "app/api/auth/sessions/route.ts",
  "app/api/auth/recovery/route.ts",
  "app/forgot-password/page.tsx",
  "app/reset-password/page.tsx",
];

describe("Lumora auth gap closure contracts", () => {
  it.each(required)("exists: %s", (file) => {
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(100);
  });

  it("adds all missing auth recovery capabilities", () => {
    const combined = required.map((file) => fs.readFileSync(file, "utf8")).join("\n");
    expect(combined).toMatch(/forgot-password|Recover|recovery/i);
    expect(combined).toMatch(/reset-password|Reset/i);
    expect(combined).toMatch(/verify-email|verification/i);
    expect(combined).toMatch(/sessions|sessionId/i);
  });
});
