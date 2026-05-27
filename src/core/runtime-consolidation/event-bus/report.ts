import { createLumoraEvent } from "./factory";
import { createInMemoryEventStore } from "./store";

export function buildUnifiedEventBusReport() {
  const store = createInMemoryEventStore();

  store.append(createLumoraEvent({
    kind: "fyp.view",
    actorId: "audit-user",
    targetId: "video-1",
    payload: { watchMs: 1200 },
    source: "runtime-consolidation-pack-07"
  }));

  store.append(createLumoraEvent({
    kind: "creator.quiet_gift",
    actorId: "audit-user",
    targetId: "creator-1",
    payload: { giftType: "candle", amount: 1 },
    source: "runtime-consolidation-pack-07"
  }));

  store.append(createLumoraEvent({
    kind: "wallet.ledger_entry",
    actorId: "system",
    targetId: "wallet-1",
    payload: { direction: "credit", amount: 1 },
    source: "runtime-consolidation-pack-07"
  }));

  return {
    generatedAt: new Date().toISOString(),
    status: "PASS",
    eventCount: store.list().length,
    domains: {
      fyp: store.byDomain("fyp").length,
      creator_alchemy: store.byDomain("creator_alchemy").length,
      wallet: store.byDomain("wallet").length
    }
  };
}
