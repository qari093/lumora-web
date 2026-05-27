import { describe, expect, it } from "vitest";
import { getEnabledFyp94SupplySources } from "../../src/lib/fyp94/supply/sources";
import { createFyp94SupplyClient } from "../../src/lib/fyp94/supply/clients";
import { getFyp94LicenseRule } from "../../src/lib/fyp94/supply/licenseRegistry";
import {
  FYP94_DEFAULT_INGESTION_SCHEDULE,
  validateFyp94IngestionSchedule,
} from "../../src/lib/fyp94/supply/schedule";
import { searchWithFyp94SourceFallback } from "../../src/lib/fyp94/supply/fallback";

describe("FYP 9.4 Pack 002 — Supply Engine Setup", () => {
  it("defines approved enabled sources", () => {
    const sources = getEnabledFyp94SupplySources();
    expect(sources.map((source) => source.id)).toContain("pexels");
    expect(sources.map((source) => source.id)).toContain("pixabay");
    expect(sources.every((source) => source.commercialUseAllowed)).toBe(true);
  });

  it("creates source ingestion clients", async () => {
    const client = createFyp94SupplyClient("pexels");
    const clips = await client.search({ query: "stunt", limit: 3 });

    expect(client.source).toBe("pexels");
    expect(clips).toHaveLength(3);
    expect(clips[0].mp4Url).toContain(".mp4");
  });

  it("registers commercial license rules", () => {
    const rule = getFyp94LicenseRule("royalty_free_commercial");
    expect(rule.commercialUseAllowed).toBe(true);
    expect(rule.modificationAllowed).toBe(true);
  });

  it("defines safe ingestion schedule", () => {
    expect(validateFyp94IngestionSchedule(FYP94_DEFAULT_INGESTION_SCHEDULE)).toBe(true);
    expect(validateFyp94IngestionSchedule({ everyHours: 1, clipsPerCycle: 500, queriesPerCycle: 30 })).toBe(false);
  });

  it("falls back if source clients fail", async () => {
    const badClient = {
      source: "pexels" as const,
      async search() {
        throw new Error("source down");
      },
    };

    const clips = await searchWithFyp94SourceFallback({
      clients: [badClient],
      query: "speed",
      limit: 2,
    });

    expect(clips).toHaveLength(2);
    expect(clips[0].source).toBe("lumora_owned");
  });
});
