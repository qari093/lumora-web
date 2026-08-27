import { describe, expect, it } from "vitest";
import { REQUIRED_ENV_KEYS, OPTIONAL_ENV_KEYS } from "@/config/lumoraEnv";
import { attachAttentionMetrics } from "@/lib/content/attention";
import { attachEmotionTags } from "@/lib/content/emotions";
import { buildBaseContent } from "@/lib/content/schema";
import { calculateTrustScore, canAccessSurgeFeatures } from "@/lib/trust/trustScore";
import { currencyFor, geoByIp, getClientIp } from "@/lib/geo";
import { getClientGeo } from "@/src/lib/geo";
import { estimateFromCounts, loadEcoFactors } from "@/lib/eco";
import { readManualReviewItems } from "@/lib/safety/review/manualReviewQueue";

describe("Zendoro Pack 1B/10 — Export Warning Cleanup", () => {
  it("restores env exports", () => {
    expect(REQUIRED_ENV_KEYS).toContain("DATABASE_URL");
    expect(OPTIONAL_ENV_KEYS).toContain("STRIPE_SECRET_KEY");
  });

  it("restores content runtime exports", () => {
    expect(attachAttentionMetrics({ score: 2 }).attention.score).toBe(2);
    expect(attachEmotionTags({ tags: ["calm"] }).emotionTags).toContain("calm");
    expect(buildBaseContent({ title: "X" }).title).toBe("X");
  });

  it("restores trust/geo/eco/safety exports", () => {
    expect(calculateTrustScore({ reports: 1 }).score).toBeLessThan(100);
    expect(
        canAccessSurgeFeatures({
          score: 90,
          level: "high",
        })
      ).toBe(true);
    expect(getClientIp()).toBe("127.0.0.1");
    expect(geoByIp("1.1.1.1").currency).toBe("EUR");
    expect(currencyFor("DE")).toBe("EUR");
    expect(getClientGeo().currency).toBe("EUR");
    expect(loadEcoFactors().currency).toBe("EUR");
    expect(estimateFromCounts({ shipments: 2 }).estimatedCo2Kg).toBeGreaterThan(0);
    expect(Array.isArray(readManualReviewItems())).toBe(true);
  });
});
