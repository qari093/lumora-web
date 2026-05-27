export type OmegaSealInput = {
  packLocks: string[];
  requiredLocks: string[];
  testsPassed: boolean;
  performancePassed: boolean;
};

export function canApplyFinalOmegaSeal(input: OmegaSealInput): boolean {
  const locks = new Set(input.packLocks);
  return (
    input.requiredLocks.every((lock) => locks.has(lock)) &&
    input.testsPassed &&
    input.performancePassed
  );
}
