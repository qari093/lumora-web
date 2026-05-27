export function shouldAnimateSwipe(deltaY: number): boolean {
  return Math.abs(deltaY) > 10;
}

export function getTranslateY(deltaY: number): string {
  return `translate3d(0, ${deltaY}px, 0)`;
}
