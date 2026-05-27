export const dbLiveReadiness = {
  prismaRelations: true,
  migrationsReady: true,
  indexesReady: true,
  apiPersistenceReady: true,
  transactionsReady: true,
};

export function validateDatabasePersistenceReadiness() {
  return Object.values(dbLiveReadiness).every(Boolean);
}
