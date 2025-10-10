import { cookies } from "next/headers";
import type { Role } from "./role";
export type User = { id: string; name: string; role: Role };
export async function getUser(): Promise<User | null> {
  const jar = await cookies();
  const role = (jar.get("role")?.value as Role) || "guest";
  const name = jar.get("name")?.value || "Guest";
  const id = jar.get("uid")?.value || "0";
  return { id, name, role };
}
