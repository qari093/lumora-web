export function audioBalance(level: number) {
  return {
    level,
    safe: level <= 0.85
  };
}
