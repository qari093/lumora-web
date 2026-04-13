export type InterestNode = {
  topic: string;
  weight: number;
};

export function buildInterestGraph(): InterestNode[] {
  return [
    { topic: "trailers", weight: 0.92 },
    { topic: "cinematic reveals", weight: 0.81 },
    { topic: "reaction culture", weight: 0.67 },
  ];
}
