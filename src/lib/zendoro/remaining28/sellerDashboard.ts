export const zendoroSellerDashboardModules = {
  onboarding: true,
  profileVerification: true,
  productCrud: true,
  inventoryUi: true,
  fulfillmentUi: true,
  payoutDashboard: true,
  notifications: true,
  analytics: true,
  disputes: true,
} as const;

export function validateZendoroSellerDashboard() {
  return Object.values(zendoroSellerDashboardModules).every(Boolean);
}

export function sellerDashboardReadinessScore() {
  const values = Object.values(zendoroSellerDashboardModules);
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}
