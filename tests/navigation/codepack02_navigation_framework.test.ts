import { describe, it, expect } from "vitest";
import { activePortal } from "@/src/core/portals/activePortal";

describe("codepack02", () => {
  it("detects active portal", () => {
    expect(activePortal("/live")).toBe("live");
  });
});
