import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack J", () => {
  const identity = fs.readFileSync("src/components/fyp/FypOmegaIdentity.tsx", "utf8");
  const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("uses inline Lumora blade, not missing image asset", () => {
    expect(identity).toContain("<svg");
    expect(identity).toContain("bladeA");
    expect(identity).not.toContain("next/image");
    expect(identity).not.toContain("lumora-blade.png");
  });

  it("keeps LumaSpace and raises bottom UI above Safari bar", () => {
    expect(player).toContain("LumaSpace");
    expect(player).toContain("+ 92px");
    expect(player).toContain("+ 176px");
  });

  it("does not contain dev IP artifact", () => {
    expect(player).not.toContain("192.168");
  });
});
