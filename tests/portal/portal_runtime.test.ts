import { describe, expect, it } from "vitest";
import { createAtmosphericPortal } from "@/lib/portal/atmosphericPortal";

describe("portal runtime", () => {
  it("creates portal", () => {
    expect(createAtmosphericPortal().active).toBe(true);
  });
});
