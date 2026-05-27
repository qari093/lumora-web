export type PaymentWebhookEvent =
  | "checkout.completed"
  | "invoice.paid"
  | "invoice.failed"
  | "subscription.cancelled"
  | "refund.created";

export function handlePaymentWebhook(type: PaymentWebhookEvent) {
  return {
    handled: true,
    type,
    ts: new Date().toISOString(),
  };
}
