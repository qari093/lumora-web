import { cookies } from "next/headers";
import AuthBarClient from "./AuthBarClient";

export default async function AuthBar() {
  const store = await cookies();
  const role = store.get("role")?.value ?? "guest";
  const name = store.get("name")?.value ?? "Guest";
  return <AuthBarClient role={role} name={name} />;
}
