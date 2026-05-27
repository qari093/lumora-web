import type { QuietGiftTransfer } from "./types";

export interface QuietGiftFraudCheck {
  ok: boolean;
  reason: string;
}

export function validateQuietGiftTransfer(input: {
  transfer: QuietGiftTransfer;
  viewerDailyGiftCount: number;
  repeatedCreatorGiftRatio: number;
  suspiciousDevice: boolean;
}): QuietGiftFraudCheck {
  if (input.suspiciousDevice) return { ok: false, reason: "suspicious_device" };
  if (input.viewerDailyGiftCount > 100) return { ok: false, reason: "viewer_daily_limit_exceeded" };
  if (input.repeatedCreatorGiftRatio > 0.85) return { ok: false, reason: "repeated_creator_ratio_high" };
  if (input.transfer.amount <= 0) return { ok: false, reason: "invalid_amount" };

  return { ok: true, reason: "quiet_gift_safe" };
}
