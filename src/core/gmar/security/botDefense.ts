export function botDefense(rate: number) {
  return {
    blocked: rate > 50
  };
}
