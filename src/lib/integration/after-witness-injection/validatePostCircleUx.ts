export function validatePostCircleUx(input: {
  afterWitness?: { triggered?: boolean };
  dashboard?: any;
}) {
  const ok = Boolean(
    input.afterWitness?.triggered === true &&
    input.dashboard?.moodRing?.visible === true &&
    input.dashboard?.traceSummary?.visible === true &&
    input.dashboard?.replaySnippet?.visible === true,
  );

  return {
    ok,
    reason: ok ? "post_circle_ux_valid" : "post_circle_ux_incomplete",
  };
}
