export type MoodBoardEntityCandidate = {
  id: string;
  title: string;
  vibeOverlap: number;
  freshnessScore: number;
  culturalScore: number;
  rightsScore: number;
};

export function selectMoodBoardEntities(
  candidates: MoodBoardEntityCandidate[],
  limit = 6
): MoodBoardEntityCandidate[] {
  return [...candidates]
    .filter(
      (item) =>
        item.id.trim().length > 0 &&
        item.title.trim().length > 0 &&
        item.rightsScore >= 55 &&
        item.culturalScore >= 55
    )
    .sort((a, b) => {
      const aScore =
        a.vibeOverlap * 0.45 +
        a.freshnessScore * 0.2 +
        a.culturalScore * 0.2 +
        a.rightsScore * 0.15;
      const bScore =
        b.vibeOverlap * 0.45 +
        b.freshnessScore * 0.2 +
        b.culturalScore * 0.2 +
        b.rightsScore * 0.15;
      return bScore - aScore;
    })
    .slice(0, Math.max(1, Math.min(12, Math.round(limit))));
}

export function hasMoodBoardEntitySelection(
  entities: MoodBoardEntityCandidate[]
): boolean {
  return entities.length > 0;
}
