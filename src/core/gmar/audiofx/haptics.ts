export function hapticFeedback(force: number) {
  return {
    active: force > 0
  };
}
