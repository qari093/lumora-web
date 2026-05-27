import { describe, expect, it } from "vitest";
import { runtimeBootstrap } from "@/src/core/runtime/bootstrap/runtimeBootstrap";

describe("runtime foundation", () => {
  it("bootstraps runtime", () => {
    expect(runtimeBootstrap().initialized).toBe(true);
  });
});
