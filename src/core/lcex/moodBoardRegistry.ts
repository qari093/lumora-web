export type MoodBoardStatus =
  | "draft"
  | "active"
  | "cooldown"
  | "archived";

export type MoodBoardCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type MoodBoardRecord = {
  id: string;
  title: string;
  category: MoodBoardCategory;
  vibeTags: string[];
  region?: string;
  language?: string;
  status: MoodBoardStatus;
  createdAt: string;
  updatedAt: string;
};

export const MOOD_BOARD_REGISTRY: MoodBoardRecord[] = [];

export function registerMoodBoard(
  board: MoodBoardRecord
): void {
  MOOD_BOARD_REGISTRY.push({
    ...board,
    id: board.id.trim(),
    title: board.title.trim(),
    vibeTags: board.vibeTags.map((tag) => tag.trim()).filter(Boolean).slice(0, 16),
    region: board.region?.trim().toLowerCase(),
    language: board.language?.trim().toLowerCase(),
  });
}

export function getMoodBoardById(
  id: string
): MoodBoardRecord | undefined {
  const normalizedId = id.trim();
  return MOOD_BOARD_REGISTRY.find((board) => board.id === normalizedId);
}

export function getActiveMoodBoards(): MoodBoardRecord[] {
  return MOOD_BOARD_REGISTRY
    .filter((board) => board.status === "active")
    .sort((a, b) => {
      const aTs = Date.parse(a.updatedAt);
      const bTs = Date.parse(b.updatedAt);
      return (Number.isNaN(bTs) ? 0 : bTs) - (Number.isNaN(aTs) ? 0 : aTs);
    });
}
