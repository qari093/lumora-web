export type OrderIntentStatus =
  | "pending"
  | "settled"
  | "expired";

export type OrderIntent = {
  orderId: string;
  psp: string;
  amountEUR: number;
  status: OrderIntentStatus;
};

const intents = new Map<string, OrderIntent>();

export function createOrderIntent(intent: OrderIntent) {
  intents.set(intent.orderId, intent);
  return intent;
}

export function settleOrderIntent(orderId: string) {
  const intent = intents.get(orderId);

  if (!intent) return null;

  if (intent.status === "settled") {
    return intent;
  }

  intent.status = "settled";

  return intent;
}
