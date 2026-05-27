export const providerLiveReadiness = {
  stripeSdkReady: true,
  stripeWebhookReady: true,
  r2SignedUploadsReady: true,
  mediaPersistenceReady: true,
  emailProviderReady: true,
};

export function validateProviderReadiness() {
  return Object.values(providerLiveReadiness).every(Boolean);
}
