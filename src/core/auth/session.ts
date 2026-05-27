export interface SessionUser {
  id: string;
  role: "fan" | "creator" | "moderator" | "admin";
}

export function getMockSession(): SessionUser {
  return {
    id: "demo-user",
    role: "creator",
  };
}
