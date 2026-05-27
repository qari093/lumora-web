export type PaymentIntent = {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
};

const intents = new Map<string, PaymentIntent>();

export function createPaymentIntent(orderId: string, amount: number, currency = "EUR") {
  const intent: PaymentIntent = {
    id: `pi_${orderId}`,
    orderId,
    amount,
    currency,
    status: "created",
  };

  intents.set(intent.id, intent);

  return intent;
}

export function markPaymentPaid(intentId: string) {
  const existing = intents.get(intentId);

  if (!existing) {
    throw new Error("PAYMENT_NOT_FOUND");
  }

  existing.status = "paid";

  return existing;
}

export function getPaymentIntent(intentId: string) {
  return intents.get(intentId) ?? null;
}
