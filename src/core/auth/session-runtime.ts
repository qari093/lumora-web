export type SessionRuntimeUser = {
  id: string;
  role: "fan" | "creator" | "admin";
};

export function validateSession(user?: SessionRuntimeUser | null) {
  return !!user?.id;
}
