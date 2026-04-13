export type MomentumInput = {
  leftVotes: number;
  rightVotes: number;
};

export type MomentumResult = {
  leader: "left" | "right" | "tie";
  delta: number;
  momentumScore: number;
};

export function calculateMomentum(input: MomentumInput): MomentumResult {
  const leftVotes = Math.max(0, input.leftVotes ?? 0);
  const rightVotes = Math.max(0, input.rightVotes ?? 0);
  const total = leftVotes + rightVotes;

  if (total === 0) {
    return {
      leader: "tie",
      delta: 0,
      momentumScore: 0,
    };
  }

  const delta = leftVotes - rightVotes;
  const leader = delta === 0 ? "tie" : delta > 0 ? "left" : "right";
  const momentumScore = Number((Math.abs(delta) / total).toFixed(4));

  return {
    leader,
    delta,
    momentumScore,
  };
}
