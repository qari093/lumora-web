export type GloryNearMissInput = {
  naturalOutcome: boolean;
  millisecondsFromFailure: number;
  squadPresent: boolean;
};

export type GloryNearMissMoment = {
  triggered: boolean;
  slowMotion: boolean;
  artificialTuning: false;
  echoEligible: boolean;
};

export function detectGloryNearMiss(input: GloryNearMissInput): GloryNearMissMoment {
  const triggered =
    input.naturalOutcome &&
    input.squadPresent &&
    input.millisecondsFromFailure > 0 &&
    input.millisecondsFromFailure <= 1000;

  return {
    triggered,
    slowMotion: triggered,
    artificialTuning: false,
    echoEligible: triggered,
  };
}
