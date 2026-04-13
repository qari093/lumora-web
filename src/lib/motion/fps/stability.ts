export type FpsSample = { frameTimeMs: number };

export function validate60Fps(samples: FpsSample[]) {
  const targetFrameMs = 1000 / 60;
  const avg = samples.length
    ? samples.reduce((a, s) => a + s.frameTimeMs, 0) / samples.length
    : 0;

  const fps = avg > 0 ? 1000 / avg : 0;

  return {
    stable: fps >= 55,
    target: 60,
    measuredFps: Number(fps.toFixed(2)),
    averageFrameTimeMs: Number(avg.toFixed(2)),
  };
}
