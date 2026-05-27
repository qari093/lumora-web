import type { QuietGiftLedgerEntry } from "./types";

const LEDGER: QuietGiftLedgerEntry[] = [];

export function persistQuietGift(entry: QuietGiftLedgerEntry): QuietGiftLedgerEntry {
  LEDGER.push(entry);
  return entry;
}

export function getQuietGiftLedger(creatorId: string): QuietGiftLedgerEntry[] {
  return LEDGER.filter((entry) => entry.creatorId === creatorId);
}
