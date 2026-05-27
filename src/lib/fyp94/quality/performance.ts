export function validateFyp94PlaybackPerformance(input: {
  startupMs: number;
  droppedFrames?: number;
  bufferEvents?: number;
}) {
  return {
    ok:
      input.startupMs <= 1200 &&
      (input.droppedFrames ?? 0) <= 5 &&
      (input.bufferEvents ?? 0) <= 1,
    reasons: [
      input.startupMs > 1200 ? "startup_too_slow" : null,
      (input.droppedFrames ?? 0) > 5 ? "too_many_dropped_frames" : null,
      (input.bufferEvents ?? 0) > 1 ? "too_many_buffer_events" : null,
    ].filter(Boolean),
  };
}
