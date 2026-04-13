import { describe, expect, it } from "vitest";
import { extractTeaserMetadata } from "@/src/core/lcex/teaserMetadataExtraction";
import { buildMetadataOnlyFallbackCard } from "@/src/core/lcex/metadataOnlyFallbackEngine";
import { canUsePosterOnlyFallback, buildPosterOnlyFallbackCard } from "@/src/core/lcex/posterOnlyTeaserFallback";
import { buildTitleReleaseFallbackCard } from "@/src/core/lcex/titleReleaseCardFallback";
import { buildWatchlistCtaFallbackCard } from "@/src/core/lcex/watchlistCtaFallback";
import { resolveTeaserFallbackHandoff } from "@/src/core/lcex/teaserFallbackHandoff";
import { detectTeaserUnavailability } from "@/src/core/lcex/teaserUnavailabilityDetector";
import { resolveRegionBlockFallback } from "@/src/core/lcex/regionBlockFallbackLogic";
import { resolveRemovedMediaFallback } from "@/src/core/lcex/removedMediaFallbackLogic";
import { resolveDegradedSourceFallback } from "@/src/core/lcex/degradedSourceFallbackLogic";

describe("lcex fallback flow coverage", () => {
  const baseInput = {
    sourceId: "lumora-editorial",
    sourceDomain: "lumora.app",
    sourceName: "Lumora Editorial",
    category: "movie" as const,
    trustState: "official" as const,
    title: "Example Reveal",
    canonicalUrl: "https://lumora.app/example",
    ingestedAt: "2026-03-29T00:00:00.000Z",
    language: "en",
    region: "global",
    rightsHint: "safe" as const,
  };

  it("covers metadata fallback creation", () => {
    const metadata = extractTeaserMetadata(baseInput);
    const card = buildMetadataOnlyFallbackCard(metadata, "missing_media");
    expect(card.type).toBe("metadata");
    expect(card.fallbackReason).toBe("missing_media");
  });

  it("covers poster-only fallback path", () => {
    const metadata = extractTeaserMetadata({
      ...baseInput,
      posterUrl: "https://img.example/poster.jpg",
    });
    expect(canUsePosterOnlyFallback(metadata)).toBe(true);
    const card = buildPosterOnlyFallbackCard(metadata);
    expect(card.posterUrl).toContain("poster.jpg");
  });

  it("covers title-release fallback path", () => {
    const metadata = extractTeaserMetadata(baseInput);
    const card = buildTitleReleaseFallbackCard(metadata);
    expect(card.title).toBe("Example Reveal");
    expect(card.type).toBe("metadata");
  });

  it("covers watchlist cta fallback path", () => {
    const metadata = extractTeaserMetadata(baseInput);
    const card = buildWatchlistCtaFallbackCard(metadata);
    expect(card.type).toBe("cta");
    expect(card.ctaLabel).toBe("Add to Watchlist");
  });

  it("covers fallback handoff poster-first behavior", () => {
    const metadata = extractTeaserMetadata({
      ...baseInput,
      posterUrl: "https://img.example/poster.jpg",
    });
    const result = resolveTeaserFallbackHandoff(metadata);
    expect(result.kind).toBe("poster-only");
  });

  it("covers teaser unavailability detection", () => {
    const result = detectTeaserUnavailability({
      rightsState: "blocked",
      teaserUrl: "https://video.example/t.mp4",
    });
    expect(result.available).toBe(false);
    expect(result.reason).toBe("blocked_media");
  });

  it("covers region block fallback logic", () => {
    const metadata = extractTeaserMetadata(baseInput);
    const result = resolveRegionBlockFallback(metadata, "de", ["us"]);
    expect(result.blocked).toBe(true);
    expect(result.fallback?.fallbackReason).toBe("blocked_media");
  });

  it("covers removed media fallback logic", () => {
    const metadata = extractTeaserMetadata(baseInput);
    const result = resolveRemovedMediaFallback(metadata, true);
    expect(result.removed).toBe(true);
    expect(result.fallback.type).toBe("metadata");
  });

  it("covers degraded source fallback logic", () => {
    const metadata = extractTeaserMetadata(baseInput);
    const result = resolveDegradedSourceFallback(metadata, true);
    expect(result.degraded).toBe(true);
    expect(result.fallback.type).toBe("metadata");
  });
});
