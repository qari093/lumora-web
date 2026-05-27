export interface MemorialVerificationInput {
  creatorPreApproved: boolean;
  familyVerified: boolean;
  documentationPresent: boolean;
}

export function verifyMemorialPermission(input: MemorialVerificationInput): boolean {
  return input.creatorPreApproved || (input.familyVerified && input.documentationPresent);
}
