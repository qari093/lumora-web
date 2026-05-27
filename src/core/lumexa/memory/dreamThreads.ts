export interface DreamThread {
  shape: string;
  fragment: string;
}

const SHAPES = [
  "quiet_day",
  "returning_spiral",
  "rising_wave"
];

export function createDreamThread(index: number): DreamThread {
  const shape = SHAPES[index % SHAPES.length];

  return {
    shape,
    fragment: `Dream fragment:${shape}`
  };
}
