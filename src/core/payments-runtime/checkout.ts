export type CheckoutKind = "subscription" | "product";

export function createCheckoutSession(input: {
  kind: CheckoutKind;
  userId: string;
  targetId: string;
  amountCents: number;
}) {
  if (input.amountCents <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  return {
    id: `checkout-${input.kind}-${input.userId}-${input.targetId}`,
    status: "created",
    checkoutUrl: `/checkout/mock/${input.targetId}`,
  };
}
