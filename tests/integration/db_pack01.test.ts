import { describe, it, expect } from "vitest";
import { pushSignal, getSignals } from "@/src/runtime/runtimeStore";

const MEGA19_TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL?.trim() || "";

const MEGA19_HAS_SAFE_TEST_DATABASE =
  /^postgres(?:ql)?:\/\//.test(MEGA19_TEST_DATABASE_URL);

if (MEGA19_HAS_SAFE_TEST_DATABASE) {
  process.env.DATABASE_URL = MEGA19_TEST_DATABASE_URL;
}

describe.skipIf(!MEGA19_HAS_SAFE_TEST_DATABASE)("DB Pack01", () => {
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
