import { describe, expect, it } from "vitest";
import { createLumoraShareLink } from "@/core/share/runtime";

describe("share runtime", () => {
  it("creates stable links", () => {
    expect(createLumoraShareLink("abc")).toBe("/l/abc");
  });
});
