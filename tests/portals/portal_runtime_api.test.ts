import { describe, it, expect } from "vitest";
import { computePortalRuntime } from "../../lib/portals/runtime";

describe("Portal runtime evaluator", () => {
  it("returns entries for key portals", () => {
    process.env.LUMORA_DATA_MODE = "seed";
    const data = computePortalRuntime("http://127.0.0.1:3040/any");
    const keys = new Set(data.map((d) => d.key));
    expect(keys.has("portals")).toBe(true);
    expect(keys.has("fyp")).toBe(true);
    expect(keys.has("videos")).toBe(true);
    expect(keys.has("gmar")).toBe(true);
    expect(keys.has("nexa")).toBe(true);
    expect(keys.has("live")).toBe(true);
    expect(keys.has("movies")).toBe(true);
    expect(keys.has("music")).toBe(true);
    expect(keys.has("share")).toBe(true);
  });
});
