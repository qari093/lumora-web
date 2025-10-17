"use client";

export default function LoginPage() {
  const setRole = async (role: string, name: string) => {
    await fetch("/api/auth/set-role", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role, name }),
    });
    location.href = "/dash/admin"; // or use ?next=
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Login (demo)</h1>
      <p>Quick set a role cookie for testing middleware.</p>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => setRole("user", "USER")}>Set USER</button>
        <button onClick={() => setRole("mod", "MOD")}>Set MOD</button>
        <button onClick={() => setRole("admin", "ADMIN")}>Set ADMIN</button>
      </div>
      <p style={{ marginTop: 16 }}>
        <a href="/dash/mod">Go to /dash/mod</a> • <a href="/dash/admin">Go to /dash/admin</a>
      </p>
    </main>
  );
}
