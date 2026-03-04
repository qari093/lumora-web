export const runtime = "nodejs";

export default function DbgMin() {
  return (
    <main style={{ padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1>dbg-min</h1>
      <p>Minimal route for render isolation.</p>
      <ul>
        <li><a href="/">/</a></li>
        <li><a href="/cineverse">/cineverse</a></li>
        <li><a href="/echo">/echo</a></li>
      </ul>
    </main>
  );
}
