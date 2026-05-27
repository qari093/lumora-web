import type { QuietGift, QuietGiftType } from "./types";

const ALLOWED_GIFTS: readonly QuietGiftType[] = ["candle", "leaf", "echo", "lantern", "star"] as const;

export function isQuietGiftType(value: string): value is QuietGiftType {
  return ALLOWED_GIFTS.includes(value as QuietGiftType);
}

export function createQuietGift(input: {
  id: string;
  type: QuietGiftType;
  creatorId: string;
  viewerId: string;
  createdAt: string;
  silentCoinsValue?: number;
}): QuietGift {
  return {
    id: input.id,
    type: input.type,
    creatorId: input.creatorId,
    viewerId: input.viewerId,
    createdAt: input.createdAt,
    silentCoinsValue: Math.max(0, Math.min(input.silentCoinsValue ?? 0, 100))
  };
}

export function giftWeight(type: QuietGiftType): number {
  switch (type) {
    case "star":
      return 10;
    case "lantern":
      return 8;
    case "echo":
      return 6;
    case "candle":
      return 5;
    case "leaf":
      return 3;
    default:
      return 1;
  }
}

export function totalGiftEnergy(gifts: readonly QuietGift[]): number {
  return gifts.reduce((sum, gift) => sum + giftWeight(gift.type) + gift.silentCoinsValue, 0);
}
