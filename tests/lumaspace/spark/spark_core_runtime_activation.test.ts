import { describe, expect, it } from "vitest";

import {
  validateLumaSpark
} from "@/src/core/lumaspace/spark/contracts/sparkContract";

import {
  createSparkRenderPlan
} from "@/src/core/lumaspace/spark/rendering/sparkRenderPlan";

import {
  createSparkStorageRecord
} from "@/src/core/lumaspace/spark/storage/sparkStorage";

import {
  createSparkEcho
} from "@/src/core/lumaspace/spark/social/sparkEcho";

import {
  createSparkStitch
} from "@/src/core/lumaspace/spark/social/sparkStitch";

import {
  runSparkRuntime
} from "@/src/core/lumaspace/spark/runtime/sparkRuntime";

const spark = {
  id: "spark_001",
  ownerId: "user_001",
  type: "calm" as const,
  durationMs: 9000,
  atmosphere: "calm",
  createdAt: Date.now()
};

const sparkTwo = {
  ...spark,
  id: "spark_002"
};

describe("LumaSpace Spark Core Runtime Activation", () => {
  it("validates spark", () => {
    expect(validateLumaSpark(spark)).toBe(true);
  });

  it("creates render plan", () => {
    const plan = createSparkRenderPlan(spark);

    expect(plan.playable).toBe(true);
    expect(plan.loop).toBe(true);
  });

  it("creates storage record", () => {
    const record = createSparkStorageRecord("spark_001");

    expect(record.sparkId).toBe("spark_001");
  });

  it("creates echo", () => {
    const echo = createSparkEcho("spark_001", 0.8);

    expect(echo.resonance).toBe(0.8);
  });

  it("creates stitch", () => {
    const stitch = createSparkStitch(
      spark,
      sparkTwo
    );

    expect(stitch.exportable).toBe(true);
  });

  it("runs runtime", () => {
    const runtime = runSparkRuntime();

    expect(runtime.active).toBe(true);
    expect(runtime.count).toBe(2);
  });
});
