import { cookies } from "next/headers";

export type Session = {
  role: string;
  name: string;
  uid: string;
};

export function getSession(): Session {
  const jar = cookies();
  const role = jar.get("role")?.value || "guest";
  const name = decodeURIComponent(jar.get("name")?.value || "GUEST_USER");
  const uid = jar.get("uid")?.value || "";
  return { role, name, uid };
}

export function hasRole(required: string | string[]): boolean {
  const need = Array.isArray(required) ? required : [required];
  return need.includes(getSession().role);
}
