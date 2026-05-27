import type { SessionUser } from "../auth/session";

export function requireCreator(user: SessionUser) {
  return user.role === "creator" || user.role === "admin";
}
