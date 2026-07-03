import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace H2 — route class Safari safety", () => {
  it("adds and removes route class in runtime", () => {
    const source = fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");
    expect(source).toContain('document.body.classList.add("lumora-lumaspace-route")');
    expect(source).toContain('document.body.classList.remove("lumora-lumaspace-route")');
  });

  it("uses stable route-scoped CSS instead of relying on body has only", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe.css", "utf8");
    expect(css).toContain("body.lumora-lumaspace-route");
    expect(css).toContain("z-index: 1000 !important");
    expect(css).toContain("background: #02030a !important");
  });
});
