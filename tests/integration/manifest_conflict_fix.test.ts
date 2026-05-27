import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("manifest conflict fix", () => {
  it("does not keep duplicate public manifest when app route exists", () => {
    const publicWebmanifest = fs.existsSync("public/manifest.webmanifest");
    const routeWebmanifest = fs.existsSync("app/manifest.webmanifest/route.ts");

    const publicJson = fs.existsSync("public/manifest.json");
    const routeJson = fs.existsSync("app/manifest.json/route.ts");

    expect(publicWebmanifest && routeWebmanifest).toBe(false);
    expect(publicJson && routeJson).toBe(false);
  });
});
