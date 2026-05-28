export type AutoMemoryReel = {
  playerId: string;
  moments: string[];
  emotionalTone: string;
  durationSeconds: number;
};

export function createAutoMemoryReel(playerId: string): AutoMemoryReel {
  return {
    playerId,
    moments: [
      "recovery",
      "teamwork",
      "victory"
    ],
    emotionalTone: "hopeful",
    durationSeconds: 30
  };
}
