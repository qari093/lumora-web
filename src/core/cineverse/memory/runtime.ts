export type SavedMoment = {
  filmId: string;
  emotion: string;
};

export function saveMoment(moment: SavedMoment) {
  return {
    ...moment,
    saved: true,
  };
}

export function buildGenome(emotions: string[]) {
  return {
    dominantEmotion: emotions[0],
    emotionalDepth: emotions.length,
  };
}
