import { describe, it, expect } from "vitest";
import fs from "node:fs";

import {
  FYP_DEPTHCANVAS_ACTIONS,
  FYP_DEPTHCANVAS_BOTTOM_NAV,
  FYP_DEPTHCANVAS_LANES,
  validateDepthCanvasModel
} from "../../../src/core/fyp/ui/depthCanvasModel";

describe("FYP Omega Pack 12", () => {
  it("defines premium DepthCanvas UI model", () => {
    const result = validateDepthCanvasModel();

    expect(result.ok).toBe(true);
    expect(FYP_DEPTHCANVAS_LANES).toContain("Wonder");
    expect(FYP_DEPTHCANVAS_ACTIONS).toContain("Space");
    expect(FYP_DEPTHCANVAS_BOTTOM_NAV).toContain("Trace");
  });

  it("creates DepthCanvas frame component", () => {
    const source = fs.readFileSync("app/fyp/DepthCanvasFrame.tsx", "utf8");

    expect(source).toContain("FYP_DEPTHCANVAS_ACTIONS");
    expect(source).toContain("FYP_DEPTHCANVAS_LANES");
    expect(source).toContain("FYP_DEPTHCANVAS_BOTTOM_NAV");
  });

  it("wraps FYP feed with DepthCanvas frame", () => {
    const source = fs.readFileSync("app/fyp/page.tsx", "utf8");

    expect(source).toContain("DepthCanvasFrame");
    expect(source).toContain("<FypAutoplayFeed items={items} />");
  });
});
