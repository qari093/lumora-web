export function watchMemory(seconds: number) {
  return { useful: seconds >= 4, seconds };
}
