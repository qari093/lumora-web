export default function Home() {
  return (
    <main style={{padding: 24, fontFamily: "ui-sans-serif, system-ui"}}>
      <h1>✅ Lumora: minimal App Router</h1>
      <p>Root page is live. Health endpoint below should return JSON.</p>
      <a href="/api/health">/api/health</a>
    </main>
  );
}
