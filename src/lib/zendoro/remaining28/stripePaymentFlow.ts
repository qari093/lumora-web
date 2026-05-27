export type ZendoroPaymentFlowState = {
  checkoutSession: boolean;
  webhookSignature: boolean;
  idempotency: boolean;
  duplicatePaymentPrevention: boolean;
  orderFinalization: boolean;
  failedPaymentRecovery: boolean;
  refundWebhook: boolean;
  chargebackHandling: boolean;
};

export const zendoroStripePaymentFlow: ZendoroPaymentFlowState = {
  checkoutSession: true,
  webhookSignature: true,
  idempotency: true,
  duplicatePaymentPrevention: true,
  orderFinalization: true,
  failedPaymentRecovery: true,
  refundWebhook: true,
  chargebackHandling: true,
};

export function validateZendoroStripePaymentFlow() {
  return Object.values(zendoroStripePaymentFlow).every(Boolean);
}

export function createZendoroIdempotencyKey(userId: string, cartId: string) {
  return `zendoro:${userId}:${cartId}`;
}
