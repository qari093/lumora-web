export type HudState = {
  hp: number;
  stamina: number;
  score: number;
};

export function createHud(): HudState {
  return {
    hp: 100,
    stamina: 100,
    score: 0
  };
}
