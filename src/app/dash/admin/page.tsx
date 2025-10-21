import { getSession } from "@/lib/auth";

export default function AdminPage() {
  const me = getSession();
  return (
    <main style={{ padding: 24 }}>
      <h1>Admin Area</h1>
      <p>Welcome, {me.name}!</p>
      <p>This page is restricted to the <b>admin</b> role.</p>
    </main>
  );
}
