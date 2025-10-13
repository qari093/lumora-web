import { getSession } from "@/src/lib/auth";

export default function ModPage() {
  const me = getSession();
  return (
    <main style={{ padding: 24 }}>
      <h1>Moderator Area</h1>
      <p>Hello {me.name}! Your role is <b>{me.role}</b>.</p>
      <p>Only <code>moderator</code> and <code>admin</code> can access this page.</p>
    </main>
  );
}
