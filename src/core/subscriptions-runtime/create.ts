export function createSubscriptionRuntime(input: {
  userId: string;
  tierId: string;
}) {
  return {
    id: `sub-${input.userId}-${input.tierId}`,
    userId: input.userId,
    tierId: input.tierId,
    status: "active",
    createdAt: new Date().toISOString(),
  };
}
