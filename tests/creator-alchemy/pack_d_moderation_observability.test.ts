import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  enqueueModerationItem,
  getModerationQueue,
  moderateCreatorAlchemyContent
} from "@/src/core/creator-alchemy/moderation";
import {
  buildObservabilitySnapshot,
  logCreatorAlchemyRuntime
} from "@/src/core/creator-alchemy/observability";

describe("Pack D — Moderation + Production Observability", () => {
  it("allows safe emotional copy", () => {
    const result = moderateCreatorAlchemyContent("Your work left a quiet trace.");
    expect(result.allow).toBe(true);
    expect(result.severity).toBe("safe");
  });

  it("blocks casino and diagnostic language", () => {
    expect(moderateCreatorAlchemyContent("Guaranteed profit jackpot creator stock").allow).toBe(false);
    expect(moderateCreatorAlchemyContent("You are depressed, diagnosis complete").allow).toBe(false);
  });

  it("queues review and block items", () => {
    enqueueModerationItem({
      id: "mod-d-1",
      source: "comment",
      content: "Your audience needs you, don't leave us",
      createdAt: "2026-01-01T00:00:00.000Z"
    });

    expect(getModerationQueue().length).toBeGreaterThan(0);
  });

  it("records runtime logs", () => {
    const log = logCreatorAlchemyRuntime({
      id: "log-d-1",
      level: "info",
      area: "creator-alchemy",
      message: "runtime healthy"
    });

    expect(log.message).toBe("runtime healthy");
  });

  it("builds observability snapshot", () => {
    const snapshot = buildObservabilitySnapshot({
      pendingQueue: 0,
      cacheHitRatio: 0.88,
      rateLimitRemaining: 10
    });

    expect(snapshot.ok).toBe(true);
    expect(snapshot.cache.ok).toBe(true);
    expect(snapshot.rateLimit.ok).toBe(true);
  });

  it("creates moderation API route", () => {
    expect(existsSync("app/api/creator-alchemy/moderation/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/moderation/route.ts", "utf8")).toContain("enqueueModerationItem");
  });

  it("creates observability API route", () => {
    expect(existsSync("app/api/creator-alchemy/observability/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/observability/route.ts", "utf8")).toContain("buildObservabilitySnapshot");
  });
});
