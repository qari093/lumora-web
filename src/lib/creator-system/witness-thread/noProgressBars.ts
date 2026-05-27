export type WitnessThreadDisplayPolicy = {
  numericProgressBarsAllowed: false;
  percentagesAllowed: false;
  toneLabelsAllowed: true;
  reason: "human_depth_not_score";
};

export function getWitnessThreadDisplayPolicy(): WitnessThreadDisplayPolicy {
  return {
    numericProgressBarsAllowed: false,
    percentagesAllowed: false,
    toneLabelsAllowed: true,
    reason: "human_depth_not_score",
  };
}
