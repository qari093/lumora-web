import { describe, it, expect } from "vitest";
import { pushSignal, getSignals } from "@/src/runtime/runtimeStore";

describe("DB Pack01", () => {
  it("writes and reads signals from DB", async () => {
    await pushSignal({
      type: "present",
      videoId: "v1",
      timestampMs: 1000,
    });

    const signals = await getSignals();
    expect(signals.length).toBeGreaterThan(0);
  });
});
