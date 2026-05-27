export const zendoroDbPersistenceContract = {
  persistentCartRecords: true,
  persistentOrderRecords: true,
  persistentPaymentRecords: true,
  persistentSellerRecords: true,
  persistentReviewRecords: true,
  transactionalInventoryLocks: true,
  migrationDryRunRequired: true,
  rollbackValidationRequired: true,
} as const;

export function validateZendoroDbPersistenceContract() {
  return Object.values(zendoroDbPersistenceContract).every(Boolean);
}
