export type PersonaPrivacy = {
  allowPublicProfile: boolean;
  allowAnalytics: boolean;
};

export function sanitizePersonaPrivacy(
  input?: Partial<PersonaPrivacy>
): PersonaPrivacy {
  return {
    allowPublicProfile: input?.allowPublicProfile ?? false,
    allowAnalytics: input?.allowAnalytics ?? false,
  };
}
