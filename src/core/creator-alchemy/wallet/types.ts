export type WalletEntryType = "silent_coin_purchase" | "quiet_gift_sent" | "quiet_gift_received" | "payout_hold";

export interface WalletEntry {
  id: string;
  creatorId?: string;
  viewerId?: string;
  type: WalletEntryType;
  amount: number;
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface CreatorWalletBalance {
  creatorId: string;
  silentCoinsReceived: number;
  payoutHold: number;
  payoutReady: boolean;
}

export interface QuietGiftPurchase {
  id: string;
  viewerId: string;
  amount: number;
  currency: "SILENT_COIN";
  createdAt: string;
}

export interface QuietGiftTransfer {
  id: string;
  viewerId: string;
  creatorId: string;
  giftType: "candle" | "leaf" | "echo" | "lantern" | "star";
  amount: number;
  createdAt: string;
}
