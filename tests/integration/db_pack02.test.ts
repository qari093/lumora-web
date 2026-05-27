import { describe, expect, it } from "vitest";
import { pushSignal } from "@/src/runtime/runtimeStore";
import { deriveDashboardState } from "@/src/runtime/runtimeBridge";
import { clearRuntimeSignals } from "@/src/runtime/runtimeTestUtils";

describe("DB Pack02", () => {
  it("derives dashboard state from persisted DB signals", async () => {
    await clearRuntimeSignals();

    await pushSignal({ type: "present", videoId: "v1", timestampMs: 1000 });
    await pushSignal({ type: "hold", videoId: "v1", timestampMs: 2500 });
    await pushSignal({ type: "rewatch", videoId: "v1", timestampMs: 500 });

    const state = await deriveDashboardState();

    expect(state.hasActivity).toBe(true);
    expect(state.totalSignals).toBe(3);
    expect(state.summary).toContain("1 present");
    expect(state.summary).toContain("1 held");
    expect(state.summary).toContain("1 returned");
    expect(state.strongestMoment?.type).toBe("rewatch");
  });
});
