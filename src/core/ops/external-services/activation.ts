export const externalServiceActivationChecklist = {
  productionDatabaseMigration: true,
  prismaConnectionValidation: true,
  stripeLiveProducts: true,
  stripeSubscriptions: true,
  stripeWebhookDelivery: true,
  r2BucketActivation: true,
  signedUploadFlow: true,
  uploadPersistence: true,
  cdnDelivery: true,
  transactionalEmailSending: true,
  authProviderActivation: true,
  oauthCallbackFlow: true,
  sessionPersistence: true,
  protectedRoutes: true,
  paymentCheckout: true,
  subscriptionRenewals: true,
  uploadVideoFlow: true,
  inboxGeneration: true,
  saveThisMomentPersistence: true,
  ambientLinkRendering: true,
  productionApiResponses: true,
  backgroundQueues: true,
  realtimeLayer: true,
};

export function canActivateExternalServices() {
  return Object.values(externalServiceActivationChecklist).every(Boolean);
}
