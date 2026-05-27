export function squadPresence(size: number) {
  return {
    size,
    active: size > 0,
    maxSafeSize: 20
  };
}
