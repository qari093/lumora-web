import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "./session";

const RANK: Record<Role, number> = {
  admin: 5,
  moderator: 4,
  creator: 3,
  advertiser: 2,
  user: 1,
  guest: 0,
};

export async function requireRole(minRole: Role) {
  const jar = await cookies();
  const role = (jar.get("role")?.value as Role) || "guest";
  if ((RANK[role] ?? 0) >= (RANK[minRole] ?? 0)) return role;
  redirect("/auth/login");
}
