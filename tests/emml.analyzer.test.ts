// @ts-nocheck
import { describe, it, expect } from "vitest";
import { computeEmmlCompositeSignal } from "../app/_client/emml-analyzer";

describe("EMML Analyzer — Composite Signal", () => {
  it("should export computeEmmlCompositeSignal", () => {
    expect(typeof computeEmmlCompositeSignal).toBe("function");
  });

  it("should return object with ok, compositeScore, raw fields", async () => {
    const out = await computeEmmlCompositeSignal();

    expect(out).toHaveProperty("ok");
    expect(out).toHaveProperty("compositeScore");
    expect(out).toHaveProperty("raw");
  });
});