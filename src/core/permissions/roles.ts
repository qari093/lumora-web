export const roles = [
  "fan",
  "creator",
  "moderator",
  "admin",
] as const;

export type Role = (typeof roles)[number];
