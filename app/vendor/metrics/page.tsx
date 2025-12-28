import { OWNER_ID } from "@/app/vendor/owner";

export const dynamic = "force-dynamic";

async function getMetrics() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/metrics/ads?ownerId=${OWNER_ID}`, { cache: "no-store" });
  if (!res.ok) throw new Error("metrics fetch failed");
  return res.json();
}

export default async function Page() {
  const m = await getMetrics();
  const by = (m?.byCreative ?? []) as any[];
  return (
    <main>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Ads Metrics — {OWNER_ID}</h1>
      <div style={{ marginBottom: 12 }}>
        <b>Totals:</b> Imps {m?.totals?.imps ?? 0} · Clicks {m?.totals?.clicks ?? 0} · Spent €{(m?.totals?.spentEuros ?? 0).toFixed(2)}
      </div>
      <table style={{ borderCollapse:"collapse", width:"100%" }}>
        <thead><tr><th align="left">Creative</th><th align="right">Imps</th><th align="right">Clicks</th></tr></thead>
        <tbody>
          {by.map(r => (<tr key={r.creativeId}><td>{r.title}</td><td align="right">{r.imps}</td><td align="right">{r.clicks}</td></tr>))}
          {by.length === 0 && <tr><td colSpan={3}>No data yet.</td></tr>}
        </tbody>
      </table>
    </main>
  );
}
