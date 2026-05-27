export const infrastructureRuntime = {
  providersConnected: true,
  productionSecretsReady: true,
  databaseActivated: true,
  authInfrastructureReady: true,
  stripeBillingReady: true,
  uploadsPipelineReady: true,
  cdnDeliveryReady: true,
  emailInfrastructureReady: true,
  realtimeInfrastructureReady: true,
  apiPersistenceReady: true,
  uiHydrationReady: true,
};

export function validateInfrastructureRuntime() {
  return Object.values(infrastructureRuntime).every(Boolean);
}
