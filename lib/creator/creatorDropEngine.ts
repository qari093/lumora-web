export type CreatorDrop = {
  creatorId: string;
  title: string;
  unlockWindowHours: number;
  atmosphere: string;
};

export function createCreatorDrop(
  creatorId: string,
  atmosphere: string
): CreatorDrop {
  return {
    creatorId,
    title: "An emotion is arriving soon.",
    unlockWindowHours: 24,
    atmosphere
  };
}
