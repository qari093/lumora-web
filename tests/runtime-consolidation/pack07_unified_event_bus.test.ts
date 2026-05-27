import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  assertLumoraEvent,
  buildUnifiedEventBusReport,
  createInMemoryEventStore,
  createLumoraEvent,
  createLumoraEventId,
  validateLumoraEvent
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 07 — Unified Event Bus", () => {
  it("creates replay-safe event ids", () => {
    const id = createLumoraEventId("fyp.view", "user-1", "2026-01-01T00:00:00.000Z");

    expect(id).toContain("evt_fyp.view_user-1_");
  });

  it("creates domain-mapped events", () => {
    const event = createLumoraEvent({
      kind: "creator.quiet_gift",
      actorId: "viewer-1",
      targetId: "creator-1",
      payload: { giftType: "candle", amount: 1 },
      source: "test"
    });

    expect(event.domain).toBe("creator_alchemy");
    expect(event.replaySafe).toBe(true);
    expect(validateLumoraEvent(event).ok).toBe(true);
  });

  it("rejects invalid events", () => {
    expect(validateLumoraEvent({}).ok).toBe(false);
    expect(() => assertLumoraEvent({})).toThrow();
  });

  it("stores and deduplicates events", () => {
    const store = createInMemoryEventStore();
    const event = createLumoraEvent({
      kind: "wallet.ledger_entry",
      actorId: "system",
      targetId: "wallet-1",
      payload: { direction: "credit", amount: 10 },
      source: "test"
    });

    store.append(event);
    store.append(event);

    expect(store.list()).toHaveLength(1);
    expect(store.byDomain("wallet")).toHaveLength(1);
  });

  it("builds unified event bus report", () => {
    const report = buildUnifiedEventBusReport();

    expect(report.status).toBe("PASS");
    expect(report.eventCount).toBe(3);

    writeFileSync("docs/runtime-consolidation/unified_event_bus_report.json", JSON.stringify(report, null, 2) + "\n");
    expect(existsSync("docs/runtime-consolidation/unified_event_bus_report.json")).toBe(true);
  });

  it("creates event bus API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/event-bus/route.ts")).toBe(true);
  });
});
