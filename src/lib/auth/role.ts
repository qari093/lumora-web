export type Role = "admin" | "creator" | "moderator" | "advertiser" | "user" | "guest";
export const ALL_ROLES: Role[] = ["admin","creator","moderator","advertiser","user","guest"];
const RANK: Record<Role, number> = { admin:5, moderator:4, creator:3, advertiser:2, user:1, guest:0 };
export function canAccess(min: Role, actual: Role): boolean { return (RANK[actual] ?? 0) >= (RANK[min] ?? 0); }
