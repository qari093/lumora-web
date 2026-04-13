export type MoodBoardSummaryInput = {
  boardId: string;
  title: string;
  dominantVibe?: string | null;
  cardCount: number;
  diversityScore: number;
  updatedAt: string;
};

export type MoodBoardSummaryCard = {
  id: string;
  type: "mood-board-summary";
  boardId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  updatedAt: string;
};

export function buildMoodBoardSummaryCard(
  input: MoodBoardSummaryInput
): MoodBoardSummaryCard {
  const dominantVibe = input.dominantVibe?.trim() || "mixed vibes";

  return {
    id: `mood-board-summary:${input.boardId.trim()}`,
    type: "mood-board-summary",
    boardId: input.boardId.trim(),
    title: input.title.trim(),
    subtitle: `Mood board led by ${dominantVibe}`,
    statsLine: `${Math.max(0, Math.round(input.cardCount))} cards • diversity ${Math.max(0, Math.round(input.diversityScore))}`,
    updatedAt: input.updatedAt,
  };
}

export function isMoodBoardSummaryCardUsable(
  card: MoodBoardSummaryCard
): boolean {
  return (
    card.boardId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
