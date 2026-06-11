import { describe, expect, it } from "vitest";

import {
  getFypSourceHealthSnapshots,
  summarizeFypSourceHealth,
  validateFypSourceHealthRuntime
} from "@/src/core/fyp/sources/sourceHealth";

describe("FYP Mega Pack 03 — Source Health Runtime", () => {
  it("creates health snapshots for all 48 sources", () => {
    const snapshots = getFypSourceHealthSnapshots();

    expect(snapshots).toHaveLength(48);
    expect(snapshots.every((snapshot) => snapshot.eligible)).toBe(true);
  });

  it("summarizes source health without blocked sources", () => {
    const summary = summarizeFypSourceHealth();

    expect(summary.total).toBe(48);
    expect(summary.blocked).toBe(0);
    expect(summary.eligible).toBe(48);
  });

  it("keeps deterministic latency inside safe runtime bounds", () => {
    const snapshots = getFypSourceHealthSnapshots();

    expect(snapshots.every((snapshot) => snapshot.latencyMs >= 80)).toBe(true);
    expect(snapshots.every((snapshot) => snapshot.latencyMs <= 499)).toBe(true);
  });

  it("validates the complete source health runtime", () => {
    expect(validateFypSourceHealthRuntime()).toBe(true);
  });
});
