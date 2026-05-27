export type AfterWitnessState = {
  creatorId: string;
  state: "after-witness";
  visible: true;
  expiresAtMs: number;
};

export function createAfterWitnessState(creatorId: string, nowMs = Date.now()): AfterWitnessState {
  return {
    creatorId,
    state: "after-witness",
    visible: true,
    expiresAtMs: nowMs + 15000,
  };
}
