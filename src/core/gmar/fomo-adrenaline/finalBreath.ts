export type FinalBreathInput = {
  highStakes: boolean;
  nearDeath: boolean;
  contributionSeconds: number;
  allySaved: boolean;
};

export type FinalBreathMoment = {
  triggered: boolean;
  honorsPlayer: boolean;
  rageQuitReductionIntent: true;
  message: string;
};

export function createFinalBreathMoment(input: FinalBreathInput): FinalBreathMoment {
  const triggered = input.highStakes && input.nearDeath;

  return {
    triggered,
    honorsPlayer: triggered,
    rageQuitReductionIntent: true,
    message: triggered
      ? `You held the line for ${Math.max(1, input.contributionSeconds)} seconds.`
      : "The breath continues.",
  };
}
