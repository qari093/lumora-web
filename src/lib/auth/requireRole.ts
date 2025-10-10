import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const RANK: Record<string, number> = { admin:5, moderator:4, creator:3, advertiser:2, user:1, guest:0 };

export async function requireRole(minRole: keyof typeof RANK, destination: string = "/auth/login") {
  const jar = await cookies();
  const role = jar.get("role")?.value || "guest";
  if ((RANK[role] ?? 0) >= (RANK[minRole] ?? 0)) return role;
  redirect(`${destination}?redirect=${encodeURIComponent("/")}`);
}
