export type Collider = {
  x: number;
  y: number;
  r: number;
};

export function detectCollision(a: Collider, b: Collider) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy) < a.r + b.r;
}
