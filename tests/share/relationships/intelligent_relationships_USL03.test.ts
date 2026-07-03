import { describe, expect, it } from "vitest";
import {
  chooseRelationshipDeliveryTiming,
  createRelationshipGraph,
  createSmartShareReminders,
  predictShareRecipients,
  relationshipStrengthScore,
  type RelationshipMemory,
  type RelationshipSignal,
} from "@/src/core/share";

const signals: RelationshipSignal[] = [
  {
    id: "rel_1",
    fromUserId: "waqar",
    toUserId: "ayesha",
    kind: "friend",
    strength: "inner_circle",
    lastInteractionAt: new Date().toISOString(),
    sharedMoods: ["wonder", "calm"],
    sharedPortals: ["fyp", "lumaspace"],
    silentShareAffinity: 0.9,
    echoShareAffinity: 0.62,
    trustScore: 0.96,
  },
  {
    id: "rel_2",
    fromUserId: "waqar",
    toUserId: "hamza",
    kind: "teammate",
    strength: "medium",
    lastInteractionAt: "2020-01-01T00:00:00.000Z",
    sharedMoods: ["focus"],
    sharedPortals: ["live"],
    silentShareAffinity: 0.2,
    echoShareAffinity: 0.2,
    trustScore: 0.55,
  },
];

const memories: RelationshipMemory[] = [
  {
    userId: "waqar",
    recipientId: "ayesha",
    preferredMoods: ["wonder"],
    preferredPortals: ["lumaspace"],
    quietHours: false,
    allowSilentShare: true,
  },
];

describe("USL Mega Pack 03 — Intelligent Relationships Ω", () => {
  it("builds a relationship graph", () => {
    const graph = createRelationshipGraph(signals);

    expect(graph.byUser("waqar")).toHaveLength(2);
    expect(graph.between("waqar", "ayesha")?.id).toBe("rel_1");
    expect(relationshipStrengthScore("inner_circle")).toBeGreaterThan(relationshipStrengthScore("weak"));
  });

  it("predicts best recipients using relationship, mood, trust, recency, and portal context", () => {
    const predictions = predictShareRecipients({
      senderId: "waqar",
      signals,
      memories,
      input: {
        kind: "video",
        sourcePortal: "fyp",
        destinationPortal: "lumaspace",
        sourceObjectId: "trace_001",
        title: "Wonder trace",
        createdBy: "waqar",
        metadata: { mood: "wonder" },
      },
    });

    expect(predictions[0].recipientId).toBe("ayesha");
    expect(predictions[0].preferredMode).toBe("silent");
    expect(predictions[0].score).toBeGreaterThan(predictions[1].score);
  });

  it("chooses silent delivery when relationship memory allows it", () => {
    const prediction = predictShareRecipients({
      senderId: "waqar",
      signals,
      memories,
      input: {
        kind: "video",
        sourcePortal: "fyp",
        destinationPortal: "lumaspace",
        sourceObjectId: "trace_001",
        title: "Wonder trace",
        createdBy: "waqar",
        metadata: { mood: "wonder" },
      },
    })[0];

    const timing = chooseRelationshipDeliveryTiming(prediction, memories[0]);

    expect(timing.delivery).toBe("silent_next_visit");
  });

  it("creates smart share reminders without noisy spam", () => {
    const predictions = predictShareRecipients({
      senderId: "waqar",
      signals,
      memories,
      input: {
        kind: "video",
        sourcePortal: "fyp",
        destinationPortal: "lumaspace",
        sourceObjectId: "trace_001",
        title: "Wonder trace",
        createdBy: "waqar",
        metadata: { mood: "wonder" },
      },
    });

    const reminders = createSmartShareReminders(predictions);

    expect(reminders.length).toBeGreaterThan(0);
    expect(reminders.length).toBeLessThanOrEqual(5);
    expect(reminders[0].message).toContain("quiet");
  });
});
