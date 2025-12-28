import type { PersonaPrivacy } from "./privacy";
import { DEFAULT_PERSONA_PRIVACY } from "./privacy";

export type PersonaSurface = "live" | "chat" | "feed";

export function shouldShowPersona(surface: PersonaSurface, privacy?: PersonaPrivacy | null): boolean {
  const p = privacy ?? DEFAULT_PERSONA_PRIVACY;
  if (p.visibility === "private") return false;
  if (surface === "live") return !!p.allowLive;
  if (surface === "chat") return !!p.allowChat;
  return !!p.allowFeed;
}
