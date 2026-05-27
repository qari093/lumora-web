import type { SessionUser } from "../auth/session";

export function requireFan(user: SessionUser) {
  return user.role === "fan";
}
