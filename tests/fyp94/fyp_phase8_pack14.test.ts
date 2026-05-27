import { describe, expect, it } from "vitest";
import {
  appendNewClips,
  archiveOldClips,
  buildRefreshCycle,
  buildRefreshLog,
  ensureMinimumPool,
} from "../../scripts/fyp94/refresh_control.mjs";

describe("Phase 8 Pack 14 — Auto Refresh + Storage Control", () => {
  const base = Array.from({ length: 320 }).map((_, i) => ({ id: i + 1 }));

  it("appends new clips", () => {
    const out = appendNewClips(base, [{ id: 999 }]);
    expect(out.length).toBe(321);
  });

  it("archives oldest clips when exceeding cap", () => {
    const large = Array.from({ length: 600 }).map((_, i) => ({ id: i + 1 }));
    const out = archiveOldClips(large);

    expect(out.length).toBeLessThanOrEqual(500);
  });

  it("ensures minimum pool size", () => {
    expect(ensureMinimumPool(base)).toBe(true);
  });

  it("builds refresh cycle correctly", () => {
    const cycle = buildRefreshCycle({
      manifest: base,
      additions: Array.from({ length: 50 }).map((_, i) => ({ id: 1000 + i })),
    });

    expect(cycle.total).toBeGreaterThan(300);
    expect(cycle.meetsMinimum).toBe(true);
  });

  it("logs refresh metrics", () => {
    const log = buildRefreshLog({ added: 50, before: 300, after: 350 });
    expect(log.delta).toBe(50);
  });
});
