export interface QuietBeginningState {
  minimalMode: boolean;
  revealLevel: number;
}

export function createQuietBeginning(): QuietBeginningState {
  return {
    minimalMode: true,
    revealLevel: 1
  };
}
