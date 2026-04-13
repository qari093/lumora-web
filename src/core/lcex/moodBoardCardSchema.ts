export type MoodBoardCardSchema = {
  id: string;
  type: "mood-board";
  boardId: string;
  title: string;
  subtitle?: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  moodTags: string[];
  itemCount: number;
  isShareable: boolean;
  createdAt: string;
  expiresAt?: string;
  region?: string;
  language?: string;
};

export function createMoodBoardCard(
  input: MoodBoardCardSchema
): MoodBoardCardSchema {
  return {
    ...input,
    moodTags: [...new Set(input.moodTags.map((tag) => tag.trim()).filter(Boolean))],
  };
}

export function isMoodBoardActive(card: MoodBoardCardSchema): boolean {
  if (!card.expiresAt) return true;
  return Date.parse(card.expiresAt) > Date.now();
}
