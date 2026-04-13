export type MoodBoardCardContract = {
  cardId: string;
  boardId: string;
  title: string;
  subtitle?: string;
  imageRef?: string;
  vibeTags: string[];
  entityRefs: string[];
  createdAt: string;
};

export function buildMoodBoardCardContract(
  input: MoodBoardCardContract
): MoodBoardCardContract {
  return {
    ...input,
    cardId: input.cardId.trim(),
    boardId: input.boardId.trim(),
    title: input.title.trim(),
    subtitle: input.subtitle?.trim(),
    imageRef: input.imageRef?.trim(),
    vibeTags: input.vibeTags.map((tag) => tag.trim()).filter(Boolean).slice(0, 12),
    entityRefs: input.entityRefs.map((ref) => ref.trim()).filter(Boolean).slice(0, 24),
  };
}

export function isMoodBoardCardContractUsable(
  card: MoodBoardCardContract
): boolean {
  return (
    card.cardId.length > 0 &&
    card.boardId.length > 0 &&
    card.title.length > 0 &&
    (card.vibeTags.length > 0 || card.entityRefs.length > 0)
  );
}
