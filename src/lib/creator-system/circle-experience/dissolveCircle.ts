export type CircleDissolveState = {
  circleId: string;
  status: "dissolving";
  message: string;
  dissolveAfterMs: number;
};

export function createCalmCircleDissolve(circleId: string): CircleDissolveState {
  return {
    circleId,
    status: "dissolving",
    message: "The circle is complete. The room will fade quietly.",
    dissolveAfterMs: 6000,
  };
}
