import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack I — Ghost Fix", () => {
  const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");
  const identity = fs.readFileSync("src/components/fyp/FypOmegaIdentity.tsx", "utf8");

  it("removes IP/debug artifacts", () => {
    expect(player).not.toContain("192.168");
    expect(identity).not.toContain("192.168");
  });

  it("removes stray standalone N and Wonder prefix", () => {
    expect(player).not.toContain(">N<");
    expect(identity).not.toContain("+ Wonder");
    expect(identity).not.toContain("+Wonder");
  });

  it("keeps canonical visible labels", () => {
    expect(player).toContain("LumaSpace");
    expect(player).toContain("Genesis Collection");
    expect(identity).toContain("LUMORA");
  });
});
