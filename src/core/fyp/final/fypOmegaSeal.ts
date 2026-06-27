export const FYP_OMEGA_REQUIRED_LOCKS = [
  ".fyp_omega_pack01_lock",
  ".fyp_omega_pack02_lock",
  ".fyp_omega_pack03_lock",
  ".fyp_omega_pack04_lock",
  ".fyp_omega_pack05_lock",
  ".fyp_omega_pack06_lock",
  ".fyp_omega_pack07_lock",
  ".fyp_omega_pack08_lock",
  ".fyp_omega_pack09_lock",
  ".fyp_omega_pack10_lock",
  ".fyp_omega_pack11_lock",
  ".fyp_omega_pack12_lock",
  ".fyp_omega_pack13_lock",
  ".fyp_omega_pack14_lock",
  ".fyp_omega_pack15_lock",
  ".fyp_omega_pack16_lock",
  ".fyp_omega_pack17_lock",
  ".fyp_omega_pack18_lock",
  ".fyp_omega_pack19_lock"
] as const;

export interface FypOmegaSealResult {
  ok: boolean;
  totalRequired: number;
  present: number;
  missing: string[];
}

export function evaluateFypOmegaSeal(
  existingLocks: string[]
): FypOmegaSealResult {
  const presentSet = new Set(existingLocks);
  const missing = FYP_OMEGA_REQUIRED_LOCKS.filter(
    lock => !presentSet.has(lock)
  );

  return {
    ok: missing.length === 0,
    totalRequired: FYP_OMEGA_REQUIRED_LOCKS.length,
    present: FYP_OMEGA_REQUIRED_LOCKS.length - missing.length,
    missing
  };
}
