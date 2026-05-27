export function hasPremiumEntitlement(input: {
  activeSubscription: boolean;
  purchased: boolean;
}) {
  return input.activeSubscription || input.purchased;
}
