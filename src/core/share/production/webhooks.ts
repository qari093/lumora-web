export function createWebhookContract(event: string) {
  return {
    event,
    version: "usl-webhook-v1",
    idempotencyRequired: true,
    signatureRequired: true,
    retryPolicy: {
      maxAttempts: 5,
      backoff: "exponential",
    },
  };
}

export function validateWebhookContract(contract: ReturnType<typeof createWebhookContract>): boolean {
  return contract.idempotencyRequired && contract.signatureRequired && contract.retryPolicy.maxAttempts >= 3;
}
