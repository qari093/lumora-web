import { appendWalletEntry } from "./ledger";
import type { QuietGiftTransfer, WalletEntry } from "./types";

const GIFT_VALUES: Record<QuietGiftTransfer["giftType"], number> = {
  leaf: 1,
  candle: 3,
  echo: 5,
  lantern: 8,
  star: 13
};

export function valueQuietGift(type: QuietGiftTransfer["giftType"]): number {
  return GIFT_VALUES[type];
}

export function createQuietGiftTransfer(input: Omit<QuietGiftTransfer, "amount">): QuietGiftTransfer {
  return {
    ...input,
    amount: valueQuietGift(input.giftType)
  };
}

export function persistQuietGiftTransfer(transfer: QuietGiftTransfer): WalletEntry[] {
  const sent = appendWalletEntry({
    id: `${transfer.id}:sent`,
    viewerId: transfer.viewerId,
    creatorId: transfer.creatorId,
    type: "quiet_gift_sent",
    amount: -transfer.amount,
    createdAt: transfer.createdAt,
    metadata: { giftType: transfer.giftType }
  });

  const received = appendWalletEntry({
    id: `${transfer.id}:received`,
    viewerId: transfer.viewerId,
    creatorId: transfer.creatorId,
    type: "quiet_gift_received",
    amount: transfer.amount,
    createdAt: transfer.createdAt,
    metadata: { giftType: transfer.giftType }
  });

  return [sent, received];
}
