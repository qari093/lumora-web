const WHISPERS = [
  "A quiet shape has formed.",
  "Something soft still lingers.",
  "A distant rhythm returns."
];

export function resolveWhisper(seed: number): string {
  return WHISPERS[seed % WHISPERS.length];
}
