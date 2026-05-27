export function rewardValidator(amount: number) {
  return {
    valid: amount >= 0 && amount <= 100,
    capped: amount <= 100
  };
}
