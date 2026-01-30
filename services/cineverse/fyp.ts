export type CineVerseItem = {
  id: string;
  title: string;
  kind: string;
  durationSec: number;
  tags: string[];
  createdAt: number;
  score: number;
};

export function rankCineVerse(items: CineVerseItem[]) {
  return [...items].sort((a, b) => {
    // Primary: score desc
    if (b.score !== a.score) return b.score - a.score;
    // Secondary: createdAt desc
    return b.createdAt - a.createdAt;
  });
}
