import Link from "next/link";
import { getSession } from "@/src/lib/auth";

export default function DashHome() {
  const me = getSession();
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Signed in as <b>{me.name}</b> with role <b>{me.role}</b></p>
      <ul>
        <li><Link href="/dash">/dash (user+)</Link></li>
        <li><Link href="/dash/mod">/dash/mod (moderator+)</Link></li>
        <li><Link href="/dash/admin">/dash/admin (admin only)</Link></li>
      </ul>
    </main>
  );
}
