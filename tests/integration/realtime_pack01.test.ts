import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { pushSignal } from "@/src/runtime/runtimeStore";
import { getRealtimeDashboardPayload } from "@/src/runtime/realtimeState";
import { resetRuntimeVersion } from "@/src/runtime/realtimeVersion";
import { clearRuntimeSignals } from "@/src/runtime/runtimeTestUtils";

describe("Realtime Pack01", () => {
  it("bumps realtime version and exposes dashboard payload", async () => {
    await clearRuntimeSignals();
    resetRuntimeVersion();

    const before = await getRealtimeDashboardPayload();

    await pushSignal({ type: "present", videoId: "v1", timestampMs: 1000 });

    const after = await getRealtimeDashboardPayload();

    expect(before.version).toBe(0);
    expect(after.version).toBe(1);
    expect(after.state.hasActivity).toBe(true);
    expect(fs.existsSync("app/api/runtime/events/route.ts")).toBe(true);

    const hook = fs.readFileSync("components/creator-dashboard/useRuntimeState.ts", "utf8");
    expect(hook).toContain("/api/runtime/events");
    expect(hook).toContain("setInterval");
  });
});
