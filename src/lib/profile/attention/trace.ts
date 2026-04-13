export type AttentionTracePoint = {
  t: number;
  focus: number;
};

export function captureAttentionTrace(): AttentionTracePoint[] {
  return [
    { t: 0, focus: 0.35 },
    { t: 900, focus: 0.62 },
    { t: 1800, focus: 0.84 },
    { t: 2600, focus: 0.71 },
  ];
}
