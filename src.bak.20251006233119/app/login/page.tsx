"use client";
import React from "react";
import { signIn } from "next-auth/react";

export default function LoginPage(){
  const [email,setEmail] = React.useState("host@lumora.app");
  const [password,setPassword] = React.useState("lumora123");
  const [error,setError] = React.useState<string | null>(null);
  const [loading,setLoading] = React.useState(false);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/live/main-room" });
    setLoading(false);
    if (!res || res.error) { setError(res?.error || "Invalid credentials"); return; }
    if (res.url) window.location.href = res.url;
  };

  return (
    <div style={{ maxWidth: 420, margin: "64px auto", padding: 20, border:"1px solid #333", borderRadius:12 }}>
      <h1 style={{ marginBottom: 8 }}>🔐 Sign in</h1>
      <form onSubmit={submit} style={{ display:"grid", gap:10 }}>
        <label>Email
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required
                 style={{ width:"100%", padding:"8px 10px", border:"1px solid #333", borderRadius:8 }} />
        </label>
        <label>Password
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required
                 style={{ width:"100%", padding:"8px 10px", border:"1px solid #333", borderRadius:8 }} />
        </label>
        <button type="submit" disabled={loading} style={btn(true)}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && <div style={{ color:"#ef4444" }}>{error}</div>}
      </form>
      <div style={{ marginTop: 12, opacity:.8 }}>
        Demo users: <code>host@lumora.app</code> / <code>member@lumora.app</code> (pass <code>lumora123</code>)
      </div>
    </div>
  );
}

function btn(active:boolean):React.CSSProperties{
  return { padding:"10px 14px", borderRadius:10, border:"1px solid #333", background: active ? "linear-gradient(180deg,#22c55e,#16a34a)" : "#111827", color: active ? "#0b0f12" : "#e5e7eb", fontWeight:800, cursor:"pointer" };
}
