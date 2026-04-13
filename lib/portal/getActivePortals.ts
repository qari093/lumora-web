import { PORTALS } from "@/config/portals";

export function getActivePortals() {
  return PORTALS.filter(p => p.enabled);
}
