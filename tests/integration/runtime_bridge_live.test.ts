import { describe, it, expect } from "vitest";
import { pushSignal, clearSignals } from "@/src/runtime/runtimeStore";
import { deriveDashboardState } from "@/src/runtime/runtimeBridge";

describe("runtime bridge live", () => {
  it("captures real signals", () => {
    clearSignals();

    pushSignal({ type: "present", videoId: "v1", timestampMs: 1000 });
    pushSignal({ type: "hold", videoId: "v1", timestampMs: 2000 });

    const state = deriveDashboardState();

    expect(state.hasActivity).toBe(true);
    expect(state.summary).toContain("present");
    expect(state.summary).toContain("held");
  });
});
