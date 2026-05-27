import { describe, expect, it } from "vitest";
import {
  applyFailover,
  createQueueJob,
  optimizeDbReads,
  scaleCircleWorkers,
  validateHighLoad,
} from "@/src/lib/integration/scaling";

describe("Pack18 Scaling Infrastructure", () => {
  it("passes scaling infra flow", () => {
    const scale = scaleCircleWorkers({ activeCircles: 100, workers: 2, maxPerWorker: 25 });
    const job = createQueueJob("circle-sync", { circleId: "c1" });
    const failover = applyFailover(false, "redis-fallback");
    const reads = optimizeDbReads([1,2,3,4], 2);

    expect(scale.requiredWorkers).toBe(4);
    expect(scale.scaleUp).toBe(true);
    expect(job.queued).toBe(true);
    expect(failover.using).toBe("redis-fallback");
    expect(reads.rows).toHaveLength(2);
    expect(validateHighLoad({ p95LatencyMs: 450, errorRate: 0.005 }).ok).toBe(true);
    expect(validateHighLoad({ p95LatencyMs: 700, errorRate: 0.005 }).ok).toBe(false);
  });
});
