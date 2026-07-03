import { describe, expect, it } from "vitest";
import {
  cancelShare,
  createShare,
  createShareTelemetryEvent,
  createUniversalShareObject,
  deliverShare,
  enqueueShare,
  markShareRetry,
  nextRetryDelayMs,
  queueShare,
  restoreFailedShare,
  subscribeShareEvents,
  transitionShare,
  validateUniversalShareObject,
} from "@/src/core/share";

describe("USL Mega Pack 01 — Universal Share Foundation Ω", () => {
  it("creates a valid universal share object", () => {
    const share = createUniversalShareObject({
      kind: "video",
      sourcePortal: "fyp",
      destinationPortal: "lumaspace",
      sourceObjectId: "trace_001",
      title: "A quiet wonder trace",
      createdBy: "founder",
      metadata: {
        mood: "wonder",
        tags: ["fyp", "lumaspace"],
        transformation: "memory_star",
      },
    });

    expect(share.id).toMatch(/^uso_/);
    expect(share.version).toBe("usl.v1");
    expect(share.lifecycle).toBe("draft");
    expect(share.integrityHash).toMatch(/^sha_/);
    expect(validateUniversalShareObject(share)).toEqual({ ok: true });
  });

  it("supports safe lifecycle transitions", () => {
    const share = createUniversalShareObject({
      kind: "memory",
      sourcePortal: "lumaspace",
      destinationPortal: "lumalink",
      sourceObjectId: "memory_001",
      title: "Shared memory",
      createdBy: "founder",
    });

    const delivered = deliverShare(transitionShare(transitionShare(transitionShare(share, "validated"), "queued"), "delivering"));

    expect(delivered.lifecycle).toBe("delivered");
    expect(delivered.telemetry.deliveredAt).toBeTruthy();
  });

  it("rejects invalid lifecycle transitions", () => {
    const share = createUniversalShareObject({
      kind: "product",
      sourcePortal: "zendoro",
      destinationPortal: "external",
      sourceObjectId: "product_001",
      title: "Giftable object",
      createdBy: "founder",
    });

    expect(() => transitionShare(share, "delivered")).toThrow("invalid_share_lifecycle_transition");
  });

  it("queues shares through the canonical queue engine", () => {
    const share = createUniversalShareObject({
      kind: "star",
      sourcePortal: "lumaspace",
      destinationPortal: "community",
      sourceObjectId: "star_001",
      title: "A shared star",
      createdBy: "founder",
    });

    const item = enqueueShare(share, "high");

    expect(item.priority).toBe("high");
    expect(item.share.lifecycle).toBe("queued");
    expect(item.retryCount).toBe(0);
  });

  it("supports retry backoff and attempt tracking", () => {
    const share = createUniversalShareObject({
      kind: "link",
      sourcePortal: "lumexa",
      destinationPortal: "external",
      sourceObjectId: "link_001",
      title: "External share",
      createdBy: "founder",
    });

    const retried = markShareRetry(enqueueShare(share));

    expect(nextRetryDelayMs(0)).toBe(500);
    expect(nextRetryDelayMs(3)).toBe(4000);
    expect(retried.retryCount).toBe(1);
    expect(retried.share.telemetry.attempts).toBe(1);
  });

  it("supports rollback without corrupting identity", () => {
    const share = createUniversalShareObject({
      kind: "constellation",
      sourcePortal: "lumaspace",
      destinationPortal: "memory_vault",
      sourceObjectId: "constellation_001",
      title: "Shared constellation",
      createdBy: "founder",
    });

    const rolledBack = restoreFailedShare(share, "destination_unavailable");

    expect(rolledBack.id).toBe(share.id);
    expect(rolledBack.lifecycle).toBe("rolled_back");
    expect(rolledBack.telemetry.failedReason).toBe("destination_unavailable");
  });

  it("emits telemetry events", () => {
    const share = createUniversalShareObject({
      kind: "live_room",
      sourcePortal: "live",
      destinationPortal: "lumaspace",
      sourceObjectId: "room_001",
      title: "Replay memory",
      createdBy: "founder",
    });

    const event = createShareTelemetryEvent("share_created", share);

    expect(event.shareId).toBe(share.id);
    expect(event.sourcePortal).toBe("live");
    expect(event.destinationPortal).toBe("lumaspace");
  });

  it("supports SDK event subscription", () => {
    const received: string[] = [];
    const unsubscribe = subscribeShareEvents((event) => received.push(event.type));

    const share = createShare({
      kind: "journey_capsule",
      sourcePortal: "creator_hub",
      destinationPortal: "lumaspace",
      sourceObjectId: "capsule_001",
      title: "Journey Capsule",
      createdBy: "founder",
    });

    const queued = queueShare(share);
    cancelShare(queued.share);
    unsubscribe();

    expect(received).toContain("share_created");
    expect(received).toContain("share_queued");
    expect(received).toContain("share_revoked");
  });
});
