import { describe, expect, it } from "vitest";
import {
  aggregateShareEvents,
  calculateShareQuality,
  createJourneyGraph,
  createRippleGraph,
  createShareAnalyticsEvent,
  detectShareTrend,
  generateShareInsights,
  recommendNextShareAction,
  summarizeRippleGraph,
} from "@/src/core/share";

describe("USL Mega Pack 09 — Intelligence & Analytics Ω", () => {
  it("creates and aggregates meaningful share analytics events", () => {
    const events = [
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "waqar", kind: "created", portal: "fyp" }),
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "ayesha", kind: "memory_planted", portal: "lumaspace", weight: 1.4 }),
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "hamza", kind: "conversation_started", portal: "lumalink", weight: 1.2 }),
    ];

    const aggregate = aggregateShareEvents(events);

    expect(aggregate.total).toBe(3);
    expect(aggregate.byPortal.lumaspace).toBe(1);
    expect(aggregate.weightedTotal).toBeGreaterThan(3);
  });

  it("builds ripple intelligence graphs", () => {
    const events = [
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "waqar", kind: "created", portal: "fyp" }),
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "ayesha", kind: "viewed", portal: "lumaspace", weight: 1.5 }),
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "hamza", kind: "conversation_started", portal: "lumalink", weight: 1.7 }),
    ];

    const graph = createRippleGraph("share_1", events);
    const summary = summarizeRippleGraph(graph);

    expect(graph.nodes).toHaveLength(3);
    expect(graph.edges).toHaveLength(2);
    expect(summary.portalReach).toBe(3);
    expect(summary.hasConversationSpark).toBe(true);
  });

  it("calculates share quality and generates insights", () => {
    const events = [
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "waqar", kind: "created", portal: "fyp" }),
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "ayesha", kind: "echo_played", portal: "lumaspace", weight: 1.5 }),
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "ayesha", kind: "memory_planted", portal: "lumaspace", weight: 1.5 }),
      createShareAnalyticsEvent({ shareId: "share_1", actorId: "hamza", kind: "conversation_started", portal: "lumalink", weight: 1.4 }),
    ];

    const ripple = createRippleGraph("share_1", events);
    const quality = calculateShareQuality({
      shareId: "share_1",
      events,
      relationshipScore: 0.9,
      portalFit: 0.88,
      moodMatch: 0.95,
    });
    const insights = generateShareInsights({ shareId: "share_1", ripple, quality });

    expect(quality.overallQuality).toBeGreaterThan(0.75);
    expect(insights.some((insight) => insight.severity === "positive")).toBe(true);
  });

  it("creates journey graph, trend detection, and next-action recommendations", () => {
    const events = [
      createShareAnalyticsEvent({ shareId: "share_2", actorId: "a", kind: "created", portal: "fyp", weight: 0.5 }),
      createShareAnalyticsEvent({ shareId: "share_2", actorId: "b", kind: "viewed", portal: "lumaspace", weight: 0.6 }),
      createShareAnalyticsEvent({ shareId: "share_2", actorId: "c", kind: "saved", portal: "lumaspace", weight: 1.5 }),
      createShareAnalyticsEvent({ shareId: "share_2", actorId: "d", kind: "reshared", portal: "lumalink", weight: 1.6 }),
    ];

    const journey = createJourneyGraph(events);
    const trend = detectShareTrend(events);
    const action = recommendNextShareAction({
      shareId: "share_2",
      emotionalDepth: 0.82,
      relationshipFit: 0.8,
      portalFit: 0.8,
      creatorValue: 0.7,
      serenityScore: 0.9,
      overallQuality: 0.82,
    });

    expect(journey[0].step).toBe(1);
    expect(trend).toBe("rising");
    expect(action).toBe("create_memory_constellation");
  });
});
