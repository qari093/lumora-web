import type { SessionUser } from "../auth/session";

export function requireAdmin(user: SessionUser) {
  return user.role === "admin";
}
