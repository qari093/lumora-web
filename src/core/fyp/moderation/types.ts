export type ModerationState =
  | "approved"
  | "review"
  | "blocked";

export type ModerationItem = {
  itemId: string;
  text: string;
  tags: string[];
  userReports: number;
};

export type ModerationDecision = {
  itemId: string;
  state: ModerationState;
  reasons: string[];
};
