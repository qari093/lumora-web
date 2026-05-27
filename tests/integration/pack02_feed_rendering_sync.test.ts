import { describe, expect, it } from "vitest";
import { buildCreatorAwareFypCard } from "@/src/lib/integration/feed-rendering/creatorAwareCard";
import { injectWitnessAwareLayer } from "@/src/lib/integration/feed-rendering/witnessAwareLayer";
import { stripVanityMetricsFromFyp } from "@/src/lib/integration/feed-rendering/vanityMetricGuard";
import { buildHumanSignalOverlay } from "@/src/lib/integration/feed-rendering/humanSignalOverlay";
import { validateFeedUiStateSync } from "@/src/lib/integration/feed-rendering/validateUiStateSync";

describe("Integration Pack02 — Feed Rendering Sync", () => {
  it("renders creator-aware FYP card", () => {
    const card = buildCreatorAwareFypCard({ id: "v1", creator: { id: "c1", name: "Mira" } });
    expect(card.creatorAware).toBe(true);
    expect(card.creatorLabel).toBe("Mira");
  });

  it("injects witness-aware UI layer", () => {
    const card = injectWitnessAwareLayer({ id: "v1" }, { witnessName: "Nova" });
    expect(card.witnessLayer.enabled).toBe(true);
    expect(card.witnessLayer.anonymous).toBe(true);
  });

  it("disables vanity metrics", () => {
    const safe = stripVanityMetricsFromFyp({ id: "v1", views: 10, likes: 3, comments: 2, followers: 8 });
    expect(safe.vanityMetricsHidden).toBe(true);
    expect("views" in safe).toBe(false);
    expect("likes" in safe).toBe(false);
  });

  it("enables human-signal overlay", () => {
    const overlay = buildHumanSignalOverlay([{ type: "present" }]);
    expect(overlay.visible).toBe(true);
    expect(overlay.showCounts).toBe(false);
    expect(overlay.interpretationText).toBe(false);
  });

  it("validates UI-state sync", () => {
    const safe = stripVanityMetricsFromFyp({ id: "v1" });
    const card = buildCreatorAwareFypCard({ ...safe, creator: { id: "c1", name: "Mira" } });
    const synced = injectWitnessAwareLayer(card, { witnessName: "Nova" });

    expect(validateFeedUiStateSync(synced).ok).toBe(true);
  });
});
