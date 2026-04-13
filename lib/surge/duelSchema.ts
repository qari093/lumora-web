export type DuelSide = {
  creatorId: string;
  contentId: string;
  votes: number;
};

export type DuelStatus = "pending" | "live" | "resolved";

export type DuelMatch = {
  id: string;
  mode: "chill" | "surge";
  left: DuelSide;
  right: DuelSide;
  status: DuelStatus;
  createdAt: number;
  startedAt?: number;
  resolvedAt?: number;
};

export function createDuelMatch(input: {
  mode?: "chill" | "surge";
  leftCreatorId: string;
  leftContentId: string;
  rightCreatorId: string;
  rightContentId: string;
}): DuelMatch {
  return {
    id: `duel_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    mode: input.mode ?? "surge",
    left: {
      creatorId: input.leftCreatorId,
      contentId: input.leftContentId,
      votes: 0,
    },
    right: {
      creatorId: input.rightCreatorId,
      contentId: input.rightContentId,
      votes: 0,
    },
    status: "pending",
    createdAt: Date.now(),
  };
}
