export function createShareMigrationPlan(fromVersion: string, toVersion: string) {
  return {
    id: `usl_migration_${fromVersion}_to_${toVersion}`,
    fromVersion,
    toVersion,
    reversible: true,
    steps: [
      "backup_share_objects",
      "migrate_metadata_schema",
      "rebuild_integrity_hashes",
      "replay_transform_manifests",
      "validate_permissions",
      "write_migration_audit",
    ],
  };
}

export function validateShareMigrationPlan(plan: ReturnType<typeof createShareMigrationPlan>): boolean {
  return plan.reversible && plan.steps.includes("validate_permissions") && plan.steps.includes("write_migration_audit");
}
