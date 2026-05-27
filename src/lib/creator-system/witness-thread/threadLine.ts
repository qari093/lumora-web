export type WitnessThreadPoint = {
  id: string;
  creatorId: string;
  witnessId: string;
  circleId: string;
  createdAt: string;
  label: string;
};

export type WitnessThreadLine = {
  creatorId: string;
  witnessId: string;
  points: WitnessThreadPoint[];
  numericProgressHidden: true;
};

export function buildWitnessThreadLine(input: {
  creatorId: string;
  witnessId: string;
  points: WitnessThreadPoint[];
}): WitnessThreadLine {
  return {
    creatorId: input.creatorId,
    witnessId: input.witnessId,
    points: [...input.points].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    numericProgressHidden: true,
  };
}
