async function getWhere() {
  try {
    const url = (process.env.NEXT_PUBLIC_BASE_URL ?? "") + "/api/whereami";
    const res = await fetch(url, { cache: "no-store" });
    return await res.json();
  } catch {
    return { ok: false };
  }
}
export default async function Local() {
  const where = await getWhere();
  return (
    <main style={{ padding: 20, fontFamily: "system-ui" }}>
      <h1>Local Services</h1>
      <pre style={{ background: "#111", color: "#0f0", padding: 12, borderRadius: 8, overflow: "auto" }}>
        {JSON.stringify(where, null, 2)}
      </pre>
      <p>POST <code>/api/weather/enqueue/local</code> to queue your local weather.</p>
      <p>POST <code>/api/news/enqueue/local</code> with trusted <code>source</code> &amp; <code>sourceUrl</code> to queue local news.</p>
    </main>
  );
}
