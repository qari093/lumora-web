import Link from "next/link";

export default function LumaspaceIndex() {
  return (
    <main style={{ padding: 24, maxWidth: 860, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 10 }}>LumaSpace</h1>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        Quick launcher for your private journals.
      </p>
      <div style={{ display: "grid", gap: 12 }}>
        <Link href="/lumaspace/reflection" style={card}>📝 Reflection Journal</Link>
        <Link href="/lumaspace/shadow" style={card}>🌑 Shadow Journal</Link>
      
        <Link href="/lumaspace/shadow/analytics" style={card}>📊 Shadow Analytics</Link>
      </div>
    </main>
  );
}

const card: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: "14px 16px",
  background: "rgba(255,255,255,.9)",
  textDecoration: "none",
  color: "#111",
  fontWeight: 700,
  display: "inline-block"
};
