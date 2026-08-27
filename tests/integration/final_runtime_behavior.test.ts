import { describe, expect, it } from "vitest";
import { clearRuntimeSignals } from "@/src/runtime/runtimeTestUtils";
import { pushSignal } from "@/src/runtime/runtimeStore";
import { deriveDashboardState } from "@/src/runtime/runtimeBridge";
import { getRealtimeDashboardPayload } from "@/src/runtime/realtimeState";
import { resetRuntimeVersion } from "@/src/runtime/realtimeVersion";

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL?.trim() || "";
const HAS_SAFE_TEST_DATABASE =
  /^postgres(?:ql)?:\/\//.test(TEST_DATABASE_URL);

if (HAS_SAFE_TEST_DATABASE) {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
}

describe.skipIf(!HAS_SAFE_TEST_DATABASE)("Final runtime behavior", () => {
  it("persists signal and exposes realtime dashboard state", async () => {
    await clearRuntimeSignals();
    resetRuntimeVersion();

    await pushSignal({ type: "present", videoId: "v1", timestampMs: 1000 });
    await pushSignal({ type: "hold", videoId: "v1", timestampMs: 3000 });

    const state = await deriveDashboardState();
    const payload = await getRealtimeDashboardPayload();

    expect(state.hasActivity).toBe(true);
    expect(state.totalSignals).toBe(2);
    expect(state.summary).toContain("present");
    expect(state.summary).toContain("held");
    expect(payload.version).toBe(2);
    expect(payload.state.totalSignals).toBe(2);
  });
});
