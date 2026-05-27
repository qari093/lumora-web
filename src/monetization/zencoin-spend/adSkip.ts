export function spendZenForAdSkip(input: {
  balance: number;
  userState: "green" | "yellow" | "red";
}) {
  const cost = input.userState === "red" ? 0 : 5;

  return {
    allowed: input.balance >= cost,
    cost,
    remaining: input.balance >= cost ? input.balance - cost : input.balance,
    reason: input.userState === "red" ? "protected_state_free_skip" : "paid_ad_skip",
  };
}
