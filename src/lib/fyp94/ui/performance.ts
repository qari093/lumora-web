export function validateFyp94UiPerformance(input: {
  renderTimeMs: number;
  frameDrop: boolean;
}) {
  return {
    ok: input.renderTimeMs <= 50 && input.frameDrop === false,
  };
}
