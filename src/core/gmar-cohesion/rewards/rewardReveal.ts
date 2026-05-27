export function rewardReveal(amount: number) {
  return {
    amount,
    celebratory: amount > 0,
    nonGambling: true
  };
}
