export function calculatePlatformFee(amount: number) {
  return Math.round(amount * 0.10);
}

export function calculateCreatorNet(amount: number) {
  return amount - calculatePlatformFee(amount);
}
