import { describe, expect, it } from "vitest";
import { resolvePulseSunHue } from "@/src/core/celebrations/pulseSun/pulseSun";
import { resolveGravity } from "@/src/core/celebrations/gravity/gravityEngine";

describe("Celebrations Mega Pack 02", () => {
  it("resolves hue", () => {
    expect(resolvePulseSunHue("birthday")).toBe("gold");
  });

  it("resolves gravity", () => {
    expect(resolveGravity(2)).toBe(20);
  });
});
