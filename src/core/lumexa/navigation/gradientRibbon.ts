export interface RibbonState {
  portal: string;
  intensity: number;
}

export function resolveRibbonPortal(value: number): RibbonState {
  if (value < 0.33) {
    return { portal: "lumaspace", intensity: value };
  }

  if (value < 0.66) {
    return { portal: "nexa", intensity: value };
  }

  return { portal: "live", intensity: value };
}
