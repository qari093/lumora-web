export function antiMeta(usage: number) {
  return {
    nerf: usage > 80
  };
}
