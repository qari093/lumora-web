// FILE: src/lib/persona/privacy.ts

export type PersonaVisibility = "public" | "friends" | "private";

export interface PersonaPrivacy {
  visibility: PersonaVisibility;
  allowLive: boolean;
  allowChat: boolean;
  allowFeed: boolean;
}

export const DEFAULT_PERSONA_PRIVACY: PersonaPrivacy = {
  visibility: "public",
  allowLive: true,
  allowChat: true,
  allowFeed: true,
};

export function sanitizePersonaPrivacy(
  input: Partial<PersonaPrivacy>
): PersonaPrivacy {
  return {
    visibility:
      input.visibility === "friends" || input.visibility === "private"
        ? input.visibility
        : "public",
    allowLive: typeof input.allowLive === "boolean" ? input.allowLive : true,
    allowChat: typeof input.allowChat === "boolean" ? input.allowChat : true,
    allowFeed: typeof input.allowFeed === "boolean" ? input.allowFeed : true,
  };
}