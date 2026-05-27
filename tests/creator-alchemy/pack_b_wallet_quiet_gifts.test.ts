import { describe, expect, it } from "vitest";
import {
  appendWalletEntry,
  calculateCreatorWalletBalance,
  createQuietGiftTransfer,
  evaluatePayoutReadiness,
  getCreatorWalletEntries,
  persistQuietGiftTransfer,
  validateQuietGiftTransfer,
  validateWalletCopy,
  valueQuietGift
} from "@/src/core/creator-alchemy/wallet";

describe("Pack B — Wallet + Quiet Gifts Real Economy", () => {
  it("values quiet gifts without casino mechanics", () => {
    expect(valueQuietGift("leaf")).toBe(1);
    expect(valueQuietGift("star")).toBe(13);
  });

  it("creates and persists quiet gift transfers", () => {
    const transfer = createQuietGiftTransfer({
      id: "gift-b-1",
      viewerId: "viewer-1",
      creatorId: "creator-b",
      giftType: "candle",
      createdAt: "2026-01-01T00:00:00.000Z"
    });

    const validation = validateQuietGiftTransfer({
      transfer,
      viewerDailyGiftCount: 1,
      repeatedCreatorGiftRatio: 0.1,
      suspiciousDevice: false
    });

    expect(validation.ok).toBe(true);

    const entries = persistQuietGiftTransfer(transfer);
    expect(entries).toHaveLength(2);
    expect(getCreatorWalletEntries("creator-b").length).toBeGreaterThanOrEqual(2);
  });

  it("blocks suspicious quiet gift behavior", () => {
    const transfer = createQuietGiftTransfer({
      id: "gift-b-2",
      viewerId: "viewer-1",
      creatorId: "creator-b",
      giftType: "star",
      createdAt: "2026-01-01T00:00:00.000Z"
    });

    const validation = validateQuietGiftTransfer({
      transfer,
      viewerDailyGiftCount: 101,
      repeatedCreatorGiftRatio: 0.1,
      suspiciousDevice: false
    });

    expect(validation.ok).toBe(false);
    expect(validation.reason).toBe("viewer_daily_limit_exceeded");
  });

  it("calculates creator wallet balance", () => {
    appendWalletEntry({
      id: "manual-b-1",
      creatorId: "creator-b-balance",
      viewerId: "viewer-1",
      type: "quiet_gift_received",
      amount: 1000,
      createdAt: "2026-01-01T00:00:00.000Z"
    });

    const balance = calculateCreatorWalletBalance("creator-b-balance");
    expect(balance.silentCoinsReceived).toBe(1000);
    expect(balance.payoutReady).toBe(true);
  });

  it("gates payouts until bridge, fraud, and verification are ready", () => {
    const balance = calculateCreatorWalletBalance("creator-b-balance");

    expect(
      evaluatePayoutReadiness({
        balance,
        fiatBridgeAllowed: false,
        fraudCleared: true,
        creatorVerified: true
      }).reason
    ).toBe("fiat_bridge_locked");

    expect(
      evaluatePayoutReadiness({
        balance,
        fiatBridgeAllowed: true,
        fraudCleared: true,
        creatorVerified: true
      }).ready
    ).toBe(true);
  });

  it("blocks gambling and pay-to-win wallet copy", () => {
    expect(validateWalletCopy("Buy reach with jackpot creator stock")).toBe(false);
    expect(validateWalletCopy("Quiet gifts support your resonance garden")).toBe(true);
  });
});
