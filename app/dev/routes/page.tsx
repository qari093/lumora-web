export const dynamic = "force-dynamic";

type RoutesPayload = {
  ok: boolean;
  nodeEnv: string;
  cwd: string;
  roots: Array<{
    root: string;
    pages: Array<{ route: string; file: string }>;
  }>;
};

async function getRoutes(): Promise<RoutesPayload | null> {
  try {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://127.0.0.1:3000";
    const res = await fetch(`${base}/api/dev/routes`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as RoutesPayload;
  } catch {
    return null;
  }
}

export default async function DevRoutesPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        <h1>Not Found</h1>
      </main>
    );
  }

  const data = await getRoutes();

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Dev Routes</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Lists App Router <code>page.*</code> files from <code>app/</code> and/or <code>src/app</code>. Dev-only.
      </p>

      {!data ? (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #333", borderRadius: 10 }}>
          <div style={{ fontWeight: 600 }}>Could not load /api/dev/routes</div>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Ensure the dev server is running on <code>127.0.0.1:3000</code>.
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 14, opacity: 0.8 }}>
            cwd: <code>{data.cwd}</code> • env: <code>{data.nodeEnv}</code>
          </div>

          <div style={{ marginTop: 16 }}>
            <input
              id="q"
              placeholder="Filter routes…"
              style={{
                width: "100%",
                maxWidth: 640,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #333",
                outline: "none",
              }}
              onChange={(e) => {
                const q = (e.target as HTMLInputElement).value.toLowerCase();
                document.querySelectorAll<HTMLElement>("[data-route]").forEach((el) => {
                  const r = (el.dataset.route || "").toLowerCase();
                  el.style.display = r.includes(q) ? "" : "none";
                });
              }}
            />
          </div>

          {data.roots.map((r) => (
            <section key={r.root} style={{ marginTop: 20 }}>
              <h2 style={{ marginBottom: 8 }}>{r.root}</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {r.pages.map((p) => (
                  <a
                    key={p.file}
                    data-route={p.route}
                    href={p.route}
                    style={{
                      display: "block",
                      padding: 12,
                      border: "1px solid #333",
                      borderRadius: 10,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{p.route}</div>
                    <div style={{ opacity: 0.75, marginTop: 4, fontSize: 12 }}>
                      <code>{p.file}</code>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  );
}
