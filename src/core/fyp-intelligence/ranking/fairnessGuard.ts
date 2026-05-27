export function fairnessGuard(repeats: number) {
  return { diversify: repeats > 3 };
}
