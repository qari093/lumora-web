import { describe, it, expect } from "vitest";
import { isHumanSignal } from "@/src/lib/creator-system/signal-integrity/humanOnly";
import { hasInference } from "@/src/lib/creator-system/signal-integrity/noInference";
import { createTrace } from "@/src/lib/creator-system/signal-integrity/trace";
import { dedupe } from "@/src/lib/creator-system/signal-integrity/dedupe";
import { buildSummary } from "@/src/lib/creator-system/signal-integrity/summary";

describe("Pack10 Signal Integrity", () => {
  it("human only", () => {
    expect(isHumanSignal("human")).toBe(true);
    expect(isHumanSignal("bot")).toBe(false);
  });

  it("reject inference", () => {
    expect(hasInference("sad")).toBe(true);
    expect(hasInference("still")).toBe(false);
  });

  it("trace works", () => {
    expect(createTrace("t1")).toHaveProperty("ts");
  });

  it("dedupe works", () => {
    expect(dedupe(["a","a","b"]).length).toBe(2);
  });

  it("summary works", () => {
    expect(buildSummary(3).count).toBe(3);
  });
});
