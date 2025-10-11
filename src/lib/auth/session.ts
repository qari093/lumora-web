import { cookies } from "next/headers";

export type Role = "admin" | "moderator" | "creator" | "advertiser" | "user" | "guest";
export type User = { id: string; name: string; role: Role };

export async function getUser(): Promise<User> {
  const jar = await cookies();
  const role = (jar.get("role")?.value as Role) || "guest";
  const name = jar.get("name")?.value || "Guest";
  const id = jar.get("uid")?.value || "0";
  return { id, name, role };
}
