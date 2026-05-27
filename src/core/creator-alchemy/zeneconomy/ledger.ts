import type { ZenEconomyLedgerEntry } from "./types";

const ZEN_LEDGER: ZenEconomyLedgerEntry[] = [];

export function appendZenEconomyEntry(entry: ZenEconomyLedgerEntry): ZenEconomyLedgerEntry {
  ZEN_LEDGER.push(entry);
  return entry;
}

export function getZenEconomyEntries(creatorId: string): ZenEconomyLedgerEntry[] {
  return ZEN_LEDGER.filter((entry) => entry.creatorId === creatorId);
}

export function calculateZenEconomyBalance(creatorId: string): number {
  return getZenEconomyEntries(creatorId).reduce((sum, entry) => sum + entry.amount, 0);
}
