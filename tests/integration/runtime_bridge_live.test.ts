import { beforeEach, describe, expect, it, vi } from "vitest";

type RuntimeSignalRow = {
  id: string;
  type: "present" | "hold" | "rewatch";
  videoId: string;
  timestampMs: number;
  createdAt: Date;
};

const runtimeDb = vi.hoisted(() => ({
  rows: [] as RuntimeSignalRow[],
  sequence: 0,
}));

vi.mock("@/src/db/client", () => ({
  prisma: {
    runtimeSignal: {
      create: vi.fn(async ({ data }: { data: Omit<RuntimeSignalRow, "id" | "createdAt"> }) => {
        runtimeDb.sequence += 1;

        const row: RuntimeSignalRow = {
          ...data,
          id: `runtime_signal_${runtimeDb.sequence}`,
          createdAt: new Date(data.timestampMs),
        };

        runtimeDb.rows.push(row);
        return row;
      }),

      findMany: vi.fn(async () =>
        [...runtimeDb.rows].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        ),
      ),

      deleteMany: vi.fn(async () => {
        const count = runtimeDb.rows.length;
        runtimeDb.rows.splice(0, runtimeDb.rows.length);
        return { count };
      }),
    },
  },
}));

import { clearSignals, pushSignal } from "@/src/runtime/runtimeStore";
import { deriveDashboardState } from "@/src/runtime/runtimeBridge";

describe("runtime bridge live", () => {
  beforeEach(async () => {
    runtimeDb.rows.splice(0, runtimeDb.rows.length);
    runtimeDb.sequence = 0;
    await clearSignals();
  });

  it("captures persisted runtime signals through the runtime-store contract", async () => {
    await pushSignal({
      type: "present",
      videoId: "v1",
      timestampMs: 1000,
    });

    await pushSignal({
      type: "hold",
      videoId: "v1",
      timestampMs: 2000,
    });

    const state = await deriveDashboardState();

    expect(state.hasActivity).toBe(true);
    expect(state.totalSignals).toBe(2);
    expect(state.summary).toContain("present");
    expect(state.summary).toContain("held");
    expect(state.strongestMoment.videoId).toBe("v1");
  });
});
