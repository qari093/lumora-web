export function holographicOpacity(depth: number) {
  return Math.max(0.2, 1 - depth * 0.1);
}
