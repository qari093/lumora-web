import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { getImportantStars, storyStars } from "@/src/core/lumaspace/story/runtime";
import { createEchoMemory, isEchoValid, ECHO_MAX_SECONDS } from "@/src/core/lumaspace/echo/runtime";
import { createMemorySpark, getMemorySparkDurationSeconds } from "@/src/core/lumaspace/memoryspark/runtime";

describe("LumaSpace Ω∞ Mega Pack 03 — Memory & Echo Civilization", () => {
  it("locks Story Constellation runtime", () => {
    expect(storyStars.length).toBeGreaterThanOrEqual(5);
    expect(getImportantStars().length).toBeGreaterThan(0);
  });

  it("locks Echo memory runtime", () => {
    const echo = createEchoMemory({
      id: "echo-1",
      memoryId: "nebula",
      transcript: "This reminds me of home.",
      visibility: "private",
      durationSeconds: 99
    });

    expect(echo.durationSeconds).toBe(ECHO_MAX_SECONDS);
    expect(isEchoValid(echo)).toBe(true);
  });

  it("locks Memory Spark runtime", () => {
    const spark = createMemorySpark(2026);
    expect(spark.title).toContain("2026");
    expect(spark.output).toBe("mp4");
    expect(getMemorySparkDurationSeconds(spark.scenes.length)).toBeGreaterThanOrEqual(45);
  });

  it("creates all canonical Memory & Echo surfaces", () => {
    [
      "src/components/lumaspace/story/StoryConstellation.tsx",
      "src/components/lumaspace/story/StoryStar.tsx",
      "src/components/lumaspace/story/ConstellationMap.tsx",
      "src/components/lumaspace/echo/EchoPlayer.tsx",
      "src/components/lumaspace/echo/EchoRecorder.tsx",
      "src/components/lumaspace/echo/EchoMemoryCard.tsx",
      "src/components/lumaspace/memoryspark/MemorySpark.tsx",
      "src/components/lumaspace/memoryspark/YearRecap.tsx"
    ].forEach((file) => expect(fs.existsSync(file)).toBe(true));
  });
});
