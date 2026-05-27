export type CelebrationState = {
  mode: string;
  gravity: number;
};

export function createCelebrationState(): CelebrationState {
  return {
    mode: "neutral",
    gravity: 0
  };
}
