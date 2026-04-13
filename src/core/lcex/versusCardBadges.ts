export type VersusCardBadgeType =
  | "first-voter"
  | "early-wave"
  | "majority-picker"
  | "tie-witness"
  | "comeback-caller"
  | "streak-voter";

export type VersusCardBadgeInput = {
  cardId: string;
  userId: string;
  voteOrder?: number;
  votedWinner?: boolean;
  sawTieMoment?: boolean;
  sawComebackMoment?: boolean;
  streakCount?: number;
};

export type VersusCardBadge = {
  id: string;
  cardId: string;
  userId: string;
  badge: VersusCardBadgeType;
};

export function buildVersusCardBadges(
  input: VersusCardBadgeInput
): VersusCardBadge[] {
  const badges: VersusCardBadge[] = [];

  if ((input.voteOrder ?? Number.POSITIVE_INFINITY) === 1) {
    badges.push({
      id: `versus-badge:${input.cardId}:${input.userId}:first-voter`,
      cardId: input.cardId.trim(),
      userId: input.userId.trim(),
      badge: "first-voter",
    });
  }

  if ((input.voteOrder ?? Number.POSITIVE_INFINITY) <= 25) {
    badges.push({
      id: `versus-badge:${input.cardId}:${input.userId}:early-wave`,
      cardId: input.cardId.trim(),
      userId: input.userId.trim(),
      badge: "early-wave",
    });
  }

  if (input.votedWinner) {
    badges.push({
      id: `versus-badge:${input.cardId}:${input.userId}:majority-picker`,
      cardId: input.cardId.trim(),
      userId: input.userId.trim(),
      badge: "majority-picker",
    });
  }

  if (input.sawTieMoment) {
    badges.push({
      id: `versus-badge:${input.cardId}:${input.userId}:tie-witness`,
      cardId: input.cardId.trim(),
      userId: input.userId.trim(),
      badge: "tie-witness",
    });
  }

  if (input.sawComebackMoment) {
    badges.push({
      id: `versus-badge:${input.cardId}:${input.userId}:comeback-caller`,
      cardId: input.cardId.trim(),
      userId: input.userId.trim(),
      badge: "comeback-caller",
    });
  }

  if ((input.streakCount ?? 0) >= 5) {
    badges.push({
      id: `versus-badge:${input.cardId}:${input.userId}:streak-voter`,
      cardId: input.cardId.trim(),
      userId: input.userId.trim(),
      badge: "streak-voter",
    });
  }

  return badges;
}

export function hasVersusCardBadge(
  badges: VersusCardBadge[],
  badge: VersusCardBadgeType
): boolean {
  return badges.some((entry) => entry.badge === badge);
}
