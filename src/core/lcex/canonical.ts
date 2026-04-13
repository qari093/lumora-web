export const LCEX_CANONICAL_ENGINE_ID = "lce-x-plus" as const;
export const LCEX_CANONICAL_ENGINE_NAME = "LCE-X+" as const;
export const LCEX_CANONICAL_ENGINE_SCOPE = "lumora-fyp" as const;

export const LCEX_CANONICAL_DECLARATION = {
  id: LCEX_CANONICAL_ENGINE_ID,
  name: LCEX_CANONICAL_ENGINE_NAME,
  scope: LCEX_CANONICAL_ENGINE_SCOPE,
  isCanonical: true,
  lockedByStep: 1,
  totalSteps: 375,
  status: "LOCKED",
} as const;

export type LcexCanonicalDeclaration = typeof LCEX_CANONICAL_DECLARATION;

export function getLcexCanonicalDeclaration(): LcexCanonicalDeclaration {
  return LCEX_CANONICAL_DECLARATION;
}

export function assertLcexCanonicalEngine(input: string): void {
  if (input !== LCEX_CANONICAL_ENGINE_ID) {
    throw new Error(
      `Non-canonical FYP engine rejected: "${input}". Expected "${LCEX_CANONICAL_ENGINE_ID}".`
    );
  }
}
