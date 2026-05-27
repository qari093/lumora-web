export function cancelSubscriptionRuntime(input: { subscriptionId: string }) {
  return {
    id: input.subscriptionId,
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
  };
}
