export function hasGpuTransformStyle(style: string): boolean {
  return style.includes("translate3d") || style.includes("will-change");
}

export function validateNoLayoutShift(input: {
  beforeTop: number;
  afterTop: number;
  tolerancePx?: number;
}): boolean {
  const tolerance = input.tolerancePx ?? 1;
  return Math.abs(input.afterTop - input.beforeTop) <= tolerance;
}
