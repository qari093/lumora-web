import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { validateRuntimeSignalInput } from "@/src/runtime/runtimeEventValidation";
import { pushSignal } from "@/src/runtime/runtimeStore";
import { getRealtimeDashboardPayload } from "@/src/runtime/realtimeState";
import { resetRuntimeVersion } from "@/src/runtime/realtimeVersion";
import { clearRuntimeSignals } from "@/src/runtime/runtimeTestUtils";

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL?.trim() || "";
const HAS_SAFE_TEST_DATABASE =
  /^postgres(?:ql)?:\/\//.test(TEST_DATABASE_URL);

if (HAS_SAFE_TEST_DATABASE) {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
}

describe.skipIf(!HAS_SAFE_TEST_DATABASE)("Realtime Pack02", () => {
  it("hardens runtime validation and refresh payload", async () => {
    await clearRuntimeSignals();
    resetRuntimeVersion();

    expect(validateRuntimeSignalInput({ type: "present", videoId: "v1" }).ok).toBe(true);
    expect(validateRuntimeSignalInput({ type: "bad", videoId: "v1" }).ok).toBe(false);
    expect(validateRuntimeSignalInput({ type: "hold", videoId: "" }).ok).toBe(false);

    await pushSignal({ type: "hold", videoId: "v1", timestampMs: 2500 });

    const payload = await getRealtimeDashboardPayload();

    expect(payload.version).toBe(1);
    expect(payload.transport).toBe("polling-realtime-v1");
    expect(payload.emittedAt).toBeTruthy();
    expect(payload.state.summary).toContain("held");

    const hook = fs.readFileSync("components/creator-dashboard/useRuntimeState.ts", "utf8");
    expect(hook).toContain("inFlight");
    expect(hook).toContain("versionRef");
    expect(hook).toContain("/api/runtime/events");
  });
});
