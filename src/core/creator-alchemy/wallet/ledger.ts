import type { CreatorWalletBalance, WalletEntry } from "./types";

const WALLET_LEDGER: WalletEntry[] = [];

export function appendWalletEntry(entry: WalletEntry): WalletEntry {
  WALLET_LEDGER.push(entry);
  return entry;
}

export function getWalletEntries(): WalletEntry[] {
  return [...WALLET_LEDGER];
}

export function getCreatorWalletEntries(creatorId: string): WalletEntry[] {
  return WALLET_LEDGER.filter((entry) => entry.creatorId === creatorId);
}

export function calculateCreatorWalletBalance(creatorId: string): CreatorWalletBalance {
  const entries = getCreatorWalletEntries(creatorId);

  const silentCoinsReceived = entries
    .filter((entry) => entry.type === "quiet_gift_received")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const payoutHold = entries
    .filter((entry) => entry.type === "payout_hold")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return {
    creatorId,
    silentCoinsReceived,
    payoutHold,
    payoutReady: silentCoinsReceived >= 1000 && payoutHold >= 0
  };
}
