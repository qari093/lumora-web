export const dynamic = "force-dynamic";

async function getJSON(url: string) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
  return r.json();
}

export default async function AdminPage() {
  const ownerId = "OWNER_A";
  const adId = "ad_demo_001";
  const currency = "EUR";

  const [perf, ledger] = await Promise.all([
    getJSON(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/ads/perf?adId=${adId}&ownerId=${ownerId}&sinceHours=24`),
    getJSON(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/wallet/ledger?ownerId=${ownerId}&currency=${currency}&limit=20`),
  ]);

  return (
    <main style={{maxWidth:900, margin:"2rem auto", padding:"0 1rem", fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans"}}>
      <h1 style={{marginBottom:8}}>Lumora Admin</h1>
      <div style={{opacity:.75, marginBottom:24}}>
        <code>ownerId={ownerId}</code> · <code>adId={adId}</code> · <code>currency={currency}</code>
      </div>

      <section style={{marginBottom:32}}>
        <h2 style={{margin:"12px 0"}}>Performance (last {perf?.window?.hours ?? 24}h)</h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:12}}>
          <Stat label="Impressions" value={perf?.totals?.impressions} />
          <Stat label="Clicks" value={perf?.totals?.clicks} />
          <Stat label="Conversions" value={perf?.totals?.conversions} />
          <Stat label="CTR" value={`${perf?.totals?.ctrPct ?? 0}%`} />
          <Stat label="CVR" value={`${perf?.totals?.cvrPct ?? 0}%`} />
        </div>
      </section>

      <section>
        <h2 style={{margin:"12px 0"}}>Recent Ledger</h2>
        <div style={{border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden"}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead style={{background:"#f9fafb"}}>
              <tr>
                <Th>ID</Th>
                <Th>Δ (cents)</Th>
                <Th>Reason</Th>
                <Th>Ad</Th>
                <Th>Event</Th>
                <Th>At</Th>
              </tr>
            </thead>
            <tbody>
              {(ledger?.entries ?? []).map((e: any) => (
                <tr key={e.id} style={{borderTop:"1px solid #f1f5f9"}}>
                  <Td mono>{e.id.slice(0,12)}…</Td>
                  <Td mono style={{color: e.deltaCents < 0 ? "#b91c1c" : "#166534"}}>{e.deltaCents}</Td>
                  <Td>{e.reason ?? "—"}</Td>
                  <Td mono>{e.adId ?? "—"}</Td>
                  <Td>{e.event ?? "—"}</Td>
                  <Td mono>{new Date(e.createdAt).toLocaleString()}</Td>
                </tr>
              ))}
              {(!ledger?.entries || ledger.entries.length===0) && (
                <tr><Td colSpan={6} style={{textAlign:"center", padding:"12px"}}>No entries yet</Td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:12, opacity:.7}}>
          Balance: <b>{ledger?.balanceCents ?? 0}</b> {ledger?.currency ?? currency} cents · {ledger?.count ?? 0} entries shown
        </div>
      </section>
    </main>
  );
}

function Stat({label, value}:{label:string; value:any}) {
  return (
    <div style={{border:"1px solid #e5e7eb", borderRadius:8, padding:"12px"}}>
      <div style={{fontSize:12, textTransform:"uppercase", letterSpacing:.4, color:"#64748b"}}>{label}</div>
      <div style={{fontSize:20, fontWeight:600}}>{value ?? "—"}</div>
    </div>
  );
}

function Th({children}:{children:any}) {
  return <th style={{textAlign:"left", padding:"10px 12px", fontSize:12, color:"#475569"}}>{children}</th>;
}
function Td({children, mono, colSpan, style}:{children:any; mono?:boolean; colSpan?:number; style?:any}) {
  return <td colSpan={colSpan} style={{padding:"10px 12px", fontFamily: mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined, ...style}}>{children}</td>;
}
